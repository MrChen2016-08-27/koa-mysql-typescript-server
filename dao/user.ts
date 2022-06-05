import models from "../model";
import { Op, Model, WhereOptions, OrOperator } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../model/user";
import User from "../model/user";
import { RoleAttributes, RoleCreationAttributes } from "../model/role";
import Role from "../model/role";
import { getRolesMaxAuth } from "../tool/auth";
import mysqlOrm from "./index";
import ApiError from "../config/ApiError";
import {
    InterfaceFindAllObject,
    ListParamsInterface,
} from "../global.interface";

// 获取用户信息(不包含密码)
export const getUser = async (
    where: WhereOptions<UserAttributes>
): Promise<User | null> => {
    let user: User | null = await models.User.findOne({
        where,
        attributes: { exclude: ["password"] },
    });

    if (user != null) {
        return user;
    }
    return null;
};

// 获取用户信息(全部信息)
export const getUserAllInfo = async (
    where: WhereOptions<UserAttributes>
): Promise<User | null> => {
    let user: User | null = await models.User.findOne({
        where,
    });
    return user;
};

// 添加用户
export const addUser = async (
    userAttr: UserCreationAttributes
): Promise<User> => {
    let user: User = await models.User.create(userAttr);
    return user;
};

// 给指定用户添加角色
export const addUserRole = async (
    userId: string | number,
    roleIds: Array<number | string>
): Promise<void> => {
    let user: User | null = await models.User.findByPk(userId);
    let roles: Role[] = [];
    if (roleIds != null && roleIds.length > 0) {
        roles = await models.Role.findAll({
            where: {
                id: {
                    [Op.or]: roleIds,
                },
            },
        });
        if (user != null) {
            await user.addRoles(roles);
        } else {
            throw ApiError("find_no_exist");
        }
    }
};

// 修改用户角色
export const updateUserRole = async (
    userId: string | number,
    roleIds: Array<number>
): Promise<void> => {
    let user: User | null = await models.User.findByPk(userId);
    // 用户必须存在
    if (user != null) {
        if (roleIds) {
            // 存在角色变化，则先清空再赋值
            await user.setRoles([]);
            if (roleIds.length > 0) {
                // 如果角色存在
                let roles: Role[] = await models.Role.findAll({
                    where: {
                        id: {
                            [Op.or]: roleIds,
                        },
                    },
                });
                await user.setRoles(roles);
            }
        }
    } else {
        throw ApiError("find_no_exist");
    }
};

// 修改用户信息
export const updateUser = async (
    id: number | string,
    user: any
): Promise<void> => {
    await models.User.update(user, {
        where: {
            id: id,
        },
    });
};

// 获取用户信息和对应角色信息
export const getUserRole = async (
    userId: string | number
): Promise<User | null> => {
    let userRole: User | null = await models.User.findOne({
        where: {
            id: userId,
        },
        attributes: { exclude: ["password"] },
        include: [
            {
                model: models.Role,
                as: "roles",
            },
        ],
    });

    return userRole;
};

// 删除用户信息
export const deleteUser = async (id: number | string): Promise<void> => {
    await models.User.destroy({
        where: {
            id,
        },
    });
};

// 获取用户列表(包含拥有角色）
export const getUserList = async (
    listParams: ListParamsInterface
): Promise<InterfaceFindAllObject> => {
    let pageNumber: number = listParams.pageNumber
        ? Number(listParams.pageNumber) - 1
        : 0;
    let pageSize: number = listParams.pageSzie || 10;

    let whereOption: WhereOptions<UserAttributes> =
        {
            
        };
    if (listParams.keyword != null) {
        let keyword: string = `%${listParams.keyword}%`;
        whereOption = {
            [Op.or]: [
                {
                    username: {
                        [Op.like]: keyword,
                    },
                },
                {
                    tel: {
                        [Op.like]: keyword,
                    },
                },
            ],
        };
    }
    if (listParams.username != null) {
        let username: string = `%${listParams.username}%`;
        whereOption = Object.assign(whereOption, {
            username: {
                [Op.like]: username,
            },
        });
    }
    if (listParams.mobile != null) {
        let mobile: string = `%${listParams.mobile}%`;
        whereOption = Object.assign(whereOption, {
            mobile: {
                [Op.like]: mobile,
            },
        });
    }

    let result: InterfaceFindAllObject = await models.User.findAndCountAll({
        where: whereOption,
        attributes: { exclude: ["password"] },
        include: [
            {
                model: models.Role,
                as: "roles",
            },
        ],
        offset: pageNumber * pageSize,
        limit: pageSize,
        order: [["createdAt", "DESC"]],
        distinct: true,
    });
    return result;
};

export const getUserAuth = async (userId: string | number): Promise<object> => {
    const roles = await getAuthByUserId(userId);
    let authority: object = getRolesMaxAuth(roles);
    return authority;
};

export const getAuthByUserId = async (
    userId: number | string
): Promise<Role[]> => {
    let roles: Role[] = await models.Role.findAll({
        include: [
            {
                model: models.User,
                as: "users",
                attributes: ["id"],
                where: {
                    id: userId,
                },
            },
        ],
    });

    return roles;
};
