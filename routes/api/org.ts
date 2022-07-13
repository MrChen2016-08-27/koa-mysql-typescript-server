import Router = require("koa-router");
import { DefaultState, Context } from 'koa';
import Org = require("../../controller/org");

const router = new Router<DefaultState, Context>();

router.prefix("/org");

router.post("/add", Org.addOrg);
router.post("/delete", Org.deleteOrg);
router.get("/list", Org.getOrgList);
router.post("/update", Org.updateOrg);
router.get("/get", Org.getOrg);


export default router;
