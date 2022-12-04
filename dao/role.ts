import models from "../model";
import { RoleAttributes, RoleCreationAttributes } from "../model/role";
import Role from "../model/role";
import { Op, Model, WhereOptions, OrOperator } from "sequelize";
import ApiError from "../config/ApiError";
import {
    InterfaceFindAllObject,
    ListParamsInterface,
} from "../global.interface";

export const addRole = async (
    addRoleParams: RoleCreationAttributes
): Promise<Role> => {
    let auth: string = JSON.stringify({});
    if (addRoleParams.authority && typeof addRoleParams.authority == "object") {
        auth = JSON.stringify(addRoleParams.authority);
    } else if (addRoleParams.authority != null) {
        auth = String(addRoleParams.authority);
    }
    let role: Role = await models.Role.create({
        name: addRoleParams.name,
        authority: auth,
    });
    let result: Role = role;
    if (typeof result.authority == "string") {
        result.authority = JSON.parse(result.authority);
    }
    return result;
};

export const getRole = async (id: number | string): Promise<Role> => {
    let role: Role | null = await models.Role.findByPk(id);

    if (role != null) {
        if (typeof role.authority == "string") {
            role.authority = JSON.parse(role.authority);
        }
        return role;
    } else {
        throw ApiError("find_no_exist");
    }
};

export const deleteRole = async (id: number | string): Promise<number> => {
    await models.Role.update(
        {
            deleted: 1,
        },
        {
            where: {
                id,
            },
        }
    );
    return 1;
};

export const getRoleList = async (
    roleListParams: ListParamsInterface
): Promise<InterfaceFindAllObject> => {
    let pageNumber: number = roleListParams.pageNumber
        ? roleListParams.pageNumber - 1
        : 0;
    let pageSize: number = roleListParams.pageSize
        ? Number(roleListParams.pageSize)
        : 10;

    let whereOption: WhereOptions<RoleAttributes> = {};
    if (roleListParams.keyword != null) {
        let keyword: string = `%${roleListParams.keyword}%`;
        whereOption = {
            [Op.or]: [
                {
                    name: {
                        [Op.like]: keyword,
                    },
                },
            ],
        };
    }
    if (roleListParams.name != null) {
        let name: string = `%${roleListParams.name}%`;
        whereOption = Object.assign(whereOption, {
            name: {
                [Op.like]: name,
            },
        });
    }
    let result: InterfaceFindAllObject = await models.Role.findAndCountAll({
        where: whereOption,
        offset: pageNumber * pageSize,
        limit: pageSize,
    });
    return result;
};

export const updateRole = async (
    updateRoleParams: RoleAttributes
): Promise<void> => {
    if (updateRoleParams.authority) {
        let auth: string = JSON.stringify({});
        if (typeof updateRoleParams.authority == "object") {
            auth = JSON.stringify(updateRoleParams.authority);
        } else if (updateRoleParams.authority != null) {
            auth = String(updateRoleParams.authority);
        }
        updateRoleParams.authority = auth;
    }
    await models.Role.update(updateRoleParams, {
        where: {
            id: updateRoleParams.id,
        },
    });
};
