import { Context } from "koa";
import { SequelizeScopeError } from "sequelize/types";
import OrgApi = require("../dao/org");
import Org, { OrgAttributes } from "../model/org";

export const getOrgList = async (ctx: Context, next: () => Promise<void>) => {
    let { formatOrgList } = await OrgApi.getOrgList();
    ctx.rest({
        orgList: formatOrgList,
    });
};

export const getOrg = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.query;
    if (id) {
        let orgData: Org | null = await OrgApi.getOrg(id as unknown as number);
        ctx.rest(orgData);
    } else {
        throw ctx.ApiError("find_no_exist");
    }
};

export const updateOrg = async (ctx: Context, next: () => Promise<void>) => {
    let orgParams = ctx.request.body;
    await OrgApi.updateOrg(orgParams);
    ctx.rest(null);
};

export const addOrg = async (ctx: Context, next: () => Promise<void>) => {
    let orgParams = ctx.request.body;
    if (!orgParams.name) {
        throw ctx.ApiError("org_form_validate_error");
    }
    let orgData: Org = await OrgApi.addOrg(orgParams);
    ctx.rest(orgData);
};

export const deleteOrg = async (ctx: Context, next: () => Promise<void>) => {
    let { id } = ctx.request.body;
    if (id) {
        await OrgApi.deleteOrg(id as number);
    }
    ctx.rest(null);
};
