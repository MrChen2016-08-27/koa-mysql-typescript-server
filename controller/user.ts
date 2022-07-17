import jwt = require("jsonwebtoken");
import config from "../config";
import Rsa = require("../tool/rsa");
import userApi = require("../dao/user");

import svgCaptcha = require("svg-captcha");
import { appRouter, AppRouterItemInterface } from "./role/menus";
import _lodash = require("lodash");
import { UserAttributes, UserCreationAttributes } from "../model/user";
import { DefaultState, Context } from "koa";
import User from "../model/user";

import bcrypt = require("bcrypt");
import { getLevels } from "./user/userConfig";
import { AuthorityInterface } from "../global.interface";
import { getRolesMaxAuth, filterAuthMenus } from "../tool/auth";
import {
    ListParamsInterface,
    InterfaceFindAllObject,
} from "../global.interface";

function sortMenus(
    authMenus: AppRouterItemInterface[],
    localMenus: AppRouterItemInterface[]
) {
    let results: AppRouterItemInterface[] = [];
    localMenus.forEach((item: AppRouterItemInterface) => {
        let result = authMenus.find((item2) => item2.id == item.id);
        if (result) {
            result = _lodash.cloneDeep(result);
            if (result.children != null && item.children != null) {
                result.children = sortMenus(result.children, item.children);
            }
            results.push(result);
        }
    });
    return results;
}

// 注册
export const register = async (ctx: Context, next: () => Promise<void>) => {
    let roleId = 3;
    let { username, name, password, tel, email, captcha, type } =
        ctx.request.body;
    let sessionCaptcha = ctx.session.captcha;
    if (!sessionCaptcha) {
        return ctx.rest(null);
    }
    // 转小写比较
    sessionCaptcha = sessionCaptcha ? sessionCaptcha.toLowerCase() : null;
    captcha = captcha ? captcha.toLowerCase() : null;
    if (!sessionCaptcha || sessionCaptcha != captcha) {
        throw ctx.ApiError("captcha_error");
    }
    const params: UserCreationAttributes = {
        username,
        name,
        password,
        tel,
        email,
        type,
    };
    let user = await registerUser(params, false, ctx);
    await userApi.addUserRole(user.id, [roleId]);
    ctx.rest(user);
};

// 登录
export const login = async (ctx: Context, next: () => Promise<void>) => {
    let { username, password, remember } = ctx.request.body;
    if (!username || !password) {
        throw ctx.ApiError("info_format_error");
    }

    let user: User | null = await userApi.getUserAllInfo({ username });
    if (!user) {
        throw ctx.ApiError("login_info_error");
    }
    // 密码解密验证
    let valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw ctx.ApiError("login_info_error");
    }
    let userData: User | null = await userApi.getUserRole(user.id);

    if (userData != null) {
        let result = {
            ...userData.toJSON(),
            authority: getRolesMaxAuth(userData.roles || []),
        };
        let roleIds = userData.roles?.map((item) => item.id);
        const uData = {
            userId: userData.id,
            username: userData.username,
            avatar: userData.avatar,
            orgId: userData.orgId,
            orgName: userData.orgName,
            roleIds: roleIds,
        };
        ctx.rest({
            token: jwt.sign({ data: uData }, config.jwt.secret, {
                expiresIn: remember
                    ? config.jwt.maxExpiresIn
                    : config.jwt.expiresIn,
            }),
            user: result,
        });
    }
};

/**
 *
 * @param {Object} params 用户信息
 * @param {Boolean} params 是否给用户绑定一个邀请码
 * @param {Object} ctx
 */
async function registerUser(
    params: UserCreationAttributes,
    isCode = false,
    ctx: Context
): Promise<User> {
    if (!params.username) {
        throw ctx.ApiError("username_not_null");
    }
    let usernameRep: RegExp = /^\w{2,12}$/g;
    let userTest: boolean = usernameRep.test(params.username);
    if (!userTest) {
        throw ctx.ApiError("username_format_error");
    }
    if (
        !params.password ||
        params.password.length < 6 ||
        params.password.length > 18
    ) {
        throw ctx.ApiError("password_format_error");
    }
    const userData: User | null = await userApi.getUser({
        username: params.username,
    });
    if (userData != null) {
        throw ctx.ApiError("user_repeat");
    }
    let user: User | null = null;
    const saltRounds: number = 10;
    // 对密码进行加密
    let hashPassword: string = await bcrypt.hash(params.password, saltRounds);
    params.password = hashPassword;
    user = await userApi.addUser(params);
    return user;
}

export const getKey = async (ctx: Context, next: () => Promise<void>) => {
    Rsa.initClientKey(ctx.session);
    ctx.rest({
        key: Rsa.getKey(ctx.session),
    });
};

export const getTokenUser = async (ctx: Context, next: () => Promise<void>) => {
    const userInfo = ctx.state.user;
    let menus = null;
    let authority: AuthorityInterface = await userApi.getUserAuth(
        userInfo.data.id
    );
    // 如果all字段为true，则放行所有权限
    if (authority.all != null && authority.all != undefined) {
        menus = appRouter;
    } else {
        // 过滤出权限菜单
        menus = filterAuthMenus(authority, appRouter);
        // 按照配置菜单重新排序
        menus = sortMenus(menus, appRouter);
    }
    ctx.rest({
        ...userInfo.data,
        menus,
    });
};

export const getRoleMenus = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.query;
    ctx.rest({
        list: appRouter,
        rights: {},
    });
};

// 后台增加用户，可自选多个角色
export const addUser = async (ctx: Context, next: () => Promise<void>) => {
    let params = ctx.request.body;
    // 角色id列表
    let { roleIds } = params;
    let user: User = await registerUser(params, params.isCode, ctx);
    await userApi.addUserRole(user.id, roleIds);
    let result: User | null = await userApi.getUserRole(user.id);
    ctx.rest(result);
};

// 获取用户信息同时返回对应角色信息
export const getUser = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.query;
    let result: User | null = await userApi.getUserRole(id as string);
    ctx.rest(result);
};

// 后台修改用户信息和权限
export const updateUserAndRole = async (
    ctx: Context,
    next: () => Promise<void>
) => {
    let params = ctx.request.body;
    let {
        id,
        nickname,
        gender,
        birth,
        experience,
        email,
        address,
        avatar,
        tel,
    } = params;
    let roleIds = params.roleIds;
    await userApi.updateUser(id, {
        id,
        nickname,
        gender,
        birth,
        experience,
        email,
        address,
        avatar,
        tel,
    });
    await userApi.updateUserRole(params.id, roleIds);
    let result = await userApi.getUserRole(params.id);
    ctx.rest(result);
};

export const deleteUser = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.request.body;
    await userApi.deleteUser(id);
    ctx.rest({});
};

export const getUserList = async (ctx: Context, next: () => Promise<void>) => {
    let params = ctx.query;
    let result: InterfaceFindAllObject = await userApi.getUserList(
        params as ListParamsInterface
    );
    ctx.rest({
        list: result.rows,
        count: result.count,
    });
};

export const logout = async (ctx: Context, next: () => Promise<void>) => {
    let user = ctx.state.user.data;
    ctx.rest({
        title: "注销成功",
    });
};

export const getSvgCaptcha = async (
    ctx: Context,
    next: () => Promise<void>
) => {
    const captcha = svgCaptcha.create({
        size: 4,
        noise: 2,
        height: 36,
        fontSize: 36,
    });
    ctx.session.captcha = captcha.text;
    ctx.rest({
        captcha: captcha.data,
    });
};

export const getMyUserInfo = async (
    ctx: Context,
    next: () => Promise<void>
) => {
    let userInfo = ctx.state.user.data;
    let user = await userApi.getUser({ id: userInfo.id });
    ctx.rest(user);
};
// 用户修改自己信息
export const updateMyUserInfo = async (
    ctx: Context,
    next: () => Promise<void>
) => {
    let userInfo = ctx.state.user.data;
    let { avatar, nickname, birth, gender, email, tel } = ctx.request.body;
    await userApi.updateUser(userInfo.id, {
        id: userInfo.id,
        avatar,
        nickname,
        birth,
        gender,
        email,
        tel,
    });
    ctx.rest(null);
};

export const getLevelData = async (ctx: Context, next: () => Promise<void>) => {
    ctx.rest({
        levels: getLevels,
    });
};
