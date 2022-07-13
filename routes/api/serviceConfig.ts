import Router = require("koa-router");
import { DefaultState, Context } from 'koa';
import ServiceConfig = require("../../controller/serviceConfig");

const router = new Router<DefaultState, Context>();

router.prefix("/service/config");

router.get("/type/get", ServiceConfig.getTypeConfig);


export default router;
