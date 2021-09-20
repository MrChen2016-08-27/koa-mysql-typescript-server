import Router = require('koa-router');
import { DefaultState, Context } from 'koa';


const router = new Router<DefaultState, Context>();
router.prefix('/test');



export default router;
