import config from "../config";
const koaJwt = require("koa-jwt");
import Koa = require("koa");
import koaBody = require("koa-body");
import Router = require("koa-router");

export const authManager = (app: Koa): void => {
    // app.use(async (ctx, next) => {
    //     await authSessionControl(ctx, next, ctx.request.path)
    // })
    // token 验证控制权限
    app.use(
        koaJwt({ secret: config.jwt.secret }).unless({ path: config.apiFilter })
    );
};

// session验证控制权限
const authSessionControl = async (ctx: any, next: () => void, path: string) => {
    const { session } = ctx;
    const result = config.apiFilter.find((api: RegExp) => api.test(path));
    if (result) {
        await next();
    } else if (session.user) {
        await next();
    } else {
        const result = path.substring(0, 5);
        if (result == "/page") {
            ctx.redirect("/page/auth");
        } else {
            ctx.response.status = 401;
            ctx.response.body = "没有权限访问";
        }
    }
};
