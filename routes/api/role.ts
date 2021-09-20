import Router = require("koa-router");
import { DefaultState, Context } from 'koa';
import Role = require("../../controller/role");

const router = new Router<DefaultState, Context>();

router.prefix("/role");

router.post("/add", Role.addRole);
router.post("/delete", Role.deleteRole);
router.get("/list", Role.getRoleList);
router.post("/update", Role.updateRole);
router.get("/get", Role.getRole);
router.get("/all/menus", Role.getAllMenus);

export default router;
