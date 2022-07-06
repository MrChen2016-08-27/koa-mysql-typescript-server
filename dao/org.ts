import models from "../model";
import { Op, Model, WhereOptions, OrOperator, CITEXT } from "sequelize";
import ApiError from "../config/ApiError";
import RedisTool from "../tool/redis";
import {
    InterfaceFindAllObject,
    ListParamsInterface,
} from "../global.interface";
import Org, { OrgAttributes, OrgCreationAttributes } from "../model/org";
import { fromJS } from "immutable";
import _ = require("lodash");
import model from "../model";

const ORG_LIST_KEY: string = "ORG_LIST_KEY";
const ORG_FORMAT_LIST_KEY: string = "ORG_FORMAT_LIST_KEY";

interface OrgListReturnInterface {
    formatOrgList: Org[];
    allOrgList: Org[];
}

// 返回所有组织架构
export const getOrgList = async (): Promise<OrgListReturnInterface> => {
    let formatOrgList: Org[] = [];
    let allOrgList: Org[] = [];
    let formatOrgCache = await RedisTool.get(ORG_FORMAT_LIST_KEY);
    let allOrgCache = await RedisTool.get(ORG_LIST_KEY);
    if (formatOrgCache && allOrgCache) {
        // 如果存在缓存，读取
        formatOrgList = JSON.parse(formatOrgCache);
        allOrgList = JSON.parse(allOrgCache);
    } else {
        // 查询所有org列表
        const allOrgList: Org[] = await models.Org.findAll({
            where: {
                deleted: {
                    [Op.eq]: 0,
                },
            },
        });
        let orgList = allOrgList.filter(
            (orgData2) => orgData2.parentId == null
        );
        // 存储格式化后的org列表
        formatOrgList = formatTreeOrgList(orgList, allOrgList);
        // 存储进缓存
        RedisTool.set(ORG_LIST_KEY, JSON.stringify(allOrgList));
        RedisTool.set(ORG_FORMAT_LIST_KEY, JSON.stringify(formatOrgList));
    }

    return {
        formatOrgList,
        allOrgList,
    };
};

function formatTreeOrgList(orgList: Org[], allOrgList: Org[]): Org[] {
    let orgResultList: Org[] = [];
    // 如果需要格式化数组与所有数据库数组相同，代表从头开始格式化
    if (orgList.length == allOrgList.length) {
        orgResultList = fromJS(orgList).toJS() as Org[];
    }
    orgResultList = orgList.map((orgData) => {
        // sequelize model转换为普通对象
        orgData = orgData.toJSON();
        let children = allOrgList.filter((orgItem) => {
            return orgItem.parentId == orgData.id;
        });
        if (children && children.length > 0) {
            children = formatTreeOrgList(children, allOrgList);
            orgData.children = children;
        } else {
            orgData.children = [];
        }
        return orgData;
    });
    return orgResultList;
}

export const getOrg = async (id: number): Promise<Org | null> => {
    let org: Org | null = await models.Org.findByPk(id);
    if (org) {
        const { allOrgList } = await getOrgList();
        let children = allOrgList.filter(
            (orgItem) => orgItem.parentId == org!.id
        );
        children = formatTreeOrgList(children, allOrgList);
        org.children = children;
    }
    return org;
};

const rootOrgId = 100000000;

interface SystemCreateOrgInfoInterface {
    orgId: number;
    depth: number;
}

async function generateOrgInfo(
    orgData: OrgCreationAttributes,
    parentDepth?: number | null
): Promise<SystemCreateOrgInfoInterface> {
    let orgId: number = rootOrgId;
    let depth = parentDepth ? parentDepth + 1 : 1;
    if (orgData.parentId) {
        let parentIdNum = getOrgIdPositionValue(orgData.parentId, parentDepth);
        let idLength = rootOrgId.toString().length;
        if (parentIdNum.toString().length < idLength) {
            let childDepthMinOrgId = Number(parentIdNum + "01");
            let childDepthMaxOrgId = Number(parentIdNum + "99");
            childDepthMinOrgId = getOrgRemainingBits(childDepthMinOrgId);
            childDepthMaxOrgId = getOrgRemainingBits(childDepthMaxOrgId);
            let orgList: Org[] = await models.Org.findAll({
                where: {
                    id: {
                        [Op.lte]: Number(childDepthMaxOrgId),
                        [Op.gte]: Number(childDepthMinOrgId),
                    },
                },
                order: [["id", "DESC"]],
                limit: 1,
                offset: 0,
            });
            if (orgList.length > 0) {
                // 同层下上一个最大的orgId
                let prevMaxChildOrgId: number = getOrgIdPositionValue(
                    orgList[0].id,
                    orgList[0].depth
                );
                orgId = prevMaxChildOrgId + 1;
                orgId = getOrgRemainingBits(orgId);
            } else {
                orgId = Number(parentIdNum + "01");
                orgId = getOrgRemainingBits(orgId);
            }
        }
    } else {
        // 树根级
        let orgList: Org[] = await models.Org.findAll({
            order: [["id", "DESC"]],
            limit: 1,
            offset: 0,
        });
        if (orgList.length > 0) {
            // 同层下上一个最大的orgId
            let prevMaxOrgId = getOrgIdPositionValue(orgList[0].id, depth);
            orgId = Number(prevMaxOrgId) + 1;
            orgId = getOrgRemainingBits(orgId);
        }
    }
    return { orgId, depth };
}

// 返回需要长度补充的0位
function getOrgRemainingBits(orgId: number | string): number {
    let orgIdStr = orgId.toString();
    let idLength = rootOrgId.toString().length;
    let str = "";
    for (let i = 0; i < idLength - orgIdStr.length; i++) {
        str += "0";
    }
    return Number(`${orgIdStr}${str}`);
}

// 返回对应层级去除0的orgId值
function getOrgIdPositionValue(orgId: number, depth?: number | null): number {
    let orgIdStr = orgId.toString();
    orgIdStr = orgIdStr.substring(0, depth ? depth * 2 : 2);
    return Number(orgIdStr);
}

export const addOrg = async (
    orgParams: OrgCreationAttributes
): Promise<Org> => {
    let parentDepth = null;
    if (orgParams.parentId) {
        // 如果父元素存在获取父元素的层级
        let parentOrg: Org | null = await models.Org.findByPk(
            orgParams.parentId
        );
        if (parentOrg) {
            parentDepth = parentOrg.depth;
        }
    }
    // 生成自定义id
    let { orgId: newId, depth } = await generateOrgInfo(orgParams, parentDepth);
    orgParams.id = newId;
    orgParams.depth = depth;
    let org: Org = await models.Org.create(orgParams);
    // 操作删除缓存数据
    await RedisTool.del(ORG_LIST_KEY);
    await RedisTool.del(ORG_FORMAT_LIST_KEY);
    return org;
};

export const updateOrg = async (orgParams: OrgAttributes): Promise<void> => {
    await models.Org.update(orgParams, {
        where: {
            id: orgParams.id,
        },
    });
    // 操作删除缓存数据
    await RedisTool.del(ORG_LIST_KEY);
    await RedisTool.del(ORG_FORMAT_LIST_KEY);
};

export const deleteOrg = async (id: number): Promise<number> => {
    await models.Org.update(
        {
            deleted: 1,
        },
        {
            where: {
                id,
            },
        }
    );
    // 操作删除缓存数据
    await RedisTool.del(ORG_LIST_KEY);
    await RedisTool.del(ORG_FORMAT_LIST_KEY);
    return 1;
};
