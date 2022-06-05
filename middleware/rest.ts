import ApiError, { ApiErrorInterface } from '../config/ApiError';
import Koa = require('koa');

/**
 * rest 接口的中间件配置
 */

// rest方法配置,  pathPrefix: REST API前缀，默认为/api/:
function restify(app: Koa, pathPrefix = '/api') {
    // REST API前缀，默认为/api/:
    pathPrefix = pathPrefix || '/page';
    app.use(async (ctx: Koa.Context, next: () => Promise<void>) => {
        // 是否是REST API前缀?
        if (ctx.request.path.startsWith(pathPrefix)) {
            // 绑定rest()方法:
            ctx.rest = (data: any) => {
                ctx.response.type = 'application/json';
                ctx.response.body = {
                    meta: {
                        code: 200
                    },
                    data
                };
            }
            try{
                await next();
            } catch(e: any) {
                console.log(e, '错误信息');
                ctx.response.type = 'application/json';
                ctx.response.body = {
                    meta: ApiError(e.code, e.message)
                }
            }
        } else {
            await next();
        }
    });
}


// 给context 添加rest和ApiError typescript声明
declare module 'koa' {
    interface Context {
        rest(data: any): void;
        ApiError: (code: string, message?: string) => ApiErrorInterface;
    }

}

// 注册错误类到 ctx, 可以使用 throw new ctx.ApiError(code) 来抛出异常
function registerApiError(app: Koa) {
    app.use(async (ctx: Koa.Context, next: () => Promise<void>) => {
        ctx.ApiError = ApiError;
    
        await next();
    })    
}

export default (app: Koa) => {
    registerApiError(app);
    restify(app);
};

