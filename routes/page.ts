import Router = require('koa-router');
import test from './page/test';
import { DefaultState, Context } from 'koa';



const router = new Router<DefaultState, Context>();
// const { addStatisAnalysis } = require('../controller/statisAnalysis')


// router.get('/*', async(ctx, next) => {
//     if (ctx.path.substring(0, 4) != '/api') {
//         addStatisAnalysis();
//     }
//     return next();
// });

router.get('/', async (ctx: Context, next: () => Promise<void>) => {
    
    await ctx.render('index', {
        title: '首页'
    });
});

router.get('/auth', async (ctx: Context, next) => {
    await ctx.render('auth', {
        title: '访问权限'
    });
});


router.use(test.routes(), test.allowedMethods());

export default router;