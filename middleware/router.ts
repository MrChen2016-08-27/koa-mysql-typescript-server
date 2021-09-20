import index from '../routes/index';
import Koa = require('koa');

// 路由中间件
export default function routerConfig(app: Koa) {
    // routes
    app.use(index.routes());
    app.use(index.allowedMethods());
}
