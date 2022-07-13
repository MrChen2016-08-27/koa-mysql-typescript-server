import Router = require("koa-router");
import user from "./api/user";
import role from "./api/role";
import serviceConfig from "./api/serviceConfig";
import { DefaultState, Context } from "koa";
const fileupload = require("./api/fileupload");

const router = new Router<DefaultState, Context>();
// const organization = require('./api/organization');

router.prefix("/api");

// api 根据配置权限 控制
const apiConfigFilter = {};

declare module "koa-router" {
    export interface ParameterizedContext {
        rest: () => void;
    }
}

router.get("/", async (ctx, next) => {
    ctx.rest({
        title: "hello koa2",
    });
});

router.get("/auth", async (ctx, next) => {
    ctx.rest({
        title: "权限验证",
    });
});

router.use(fileupload.routes(), fileupload.allowedMethods());
router.use(user.routes(), user.allowedMethods());
router.use(role.routes(), role.allowedMethods());
router.use(serviceConfig.routes(), serviceConfig.allowedMethods());

export default router;
