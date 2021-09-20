import { DefaultState, Context } from 'koa';
import roleApi = require("../dao/role");
import appRouter = require("./role/menus");
import { RoleAttributes } from "../model/role";
import { InterfaceFindAllObject, ListParamsInterface } from "../global.interface";

export const addRole = async (ctx: Context, next: () => Promise<void>) => {
    let params = ctx.request.body;
    try {
        let role: RoleAttributes = await roleApi.addRole(params);
        ctx.rest(role);
    } catch (e) {
        if (e.name == "SequelizeUniqueConstraintError") {
            throw ctx.ApiError("role_name_repeat");
        }
    }
};

export const deleteRole = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.request.body;
    if (id == 1) {
        throw ctx.ApiError("super_admin_not_delete");
    }
    await roleApi.deleteRole(id);
    ctx.rest({});
};

export const getRoleList = async (ctx: Context, next: () => Promise<void>) => {
    let params = ctx.query;
    let result: InterfaceFindAllObject = await roleApi.getRoleList(params as ListParamsInterface);
    ctx.rest({
        list: result.rows,
        count: result.count,
    });
};

export const updateRole = async (ctx: Context, next: () => Promise<void>) => {
    let params = ctx.request.body;
    if (params.id == 1) {
        throw ctx.ApiError("super_admin_not_update");
    }
    if (params.authority) {
        delete params.authority.all;
    }
    try {
        await roleApi.updateRole(params);
    } catch (e) {
        if (e.name == "SequelizeUniqueConstraintError") {
            throw ctx.ApiError("role_name_repeat");
        } else {
            throw e;
        }
    }
    ctx.rest({});
};

export const getRole = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.query;
    let role: RoleAttributes = await roleApi.getRole(id as string);
    ctx.rest(role);
};

export const getAllMenus = async (ctx: Context, next: () => Promise<void>) => {
    ctx.rest(appRouter);
};
