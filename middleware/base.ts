import views = require("koa-views");
import json = require("koa-json");
const onerror = require("koa-onerror");
import bodyparser = require("koa-bodyparser");
import logger = require("koa-logger");
import helmet = require("koa-helmet");
const session = require("koa-session-redis");
import config from "../config";
import staticCache = require("koa-static-cache");
import path = require("path");
import Koa = require("koa");
const xss = require("node-xss").clean;

const render: Koa.Middleware = views(__dirname + "/../views", {
    extension: "ejs",
});

// 启动时获取第三方 token 并保存 redis
// require('../tool/token');

// 基本中间件
function base(app: Koa) {
    app.use(render);
    // middlewares
    app.use(
        staticCache(config.resource.context, {
            preload: false,
            dynamic: true,
        })
    );
    app.use(
        staticCache(config.resource.public, {
            preload: false,
            dynamic: true,
        })
    );
    app.use(
        bodyparser({
            enableTypes: ["json", "form", "text"],
        })
    );
    app.use(json());
    app.use(logger());

    // logger
    app.use(async (ctx: any, next: any) => {
        const start: number = new Date().getTime();
        await next();
        const end: number = new Date().getTime();
        const ms: number = end - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
    });

    app.use(helmet());

    // koa-session-redis
    app.keys = ["app secret"];
    app.use(
        session({
            store: {
                host: config.redis.host,
                port: config.redis.port,
                ttl: config.redis.ttl,
            },
        })
    );

    // 防止 xss 攻击
    app.use(async (ctx: Koa.Context, next: () => Promise<void>) => {
        if (ctx.request.body) {
            let bodyString = JSON.stringify(ctx.request.body);
            let parseBodyString = xss(bodyString);
            let body = JSON.parse(parseBodyString);
            ctx.request.body = body;
        }
        await next();
    });
}

export default base;
