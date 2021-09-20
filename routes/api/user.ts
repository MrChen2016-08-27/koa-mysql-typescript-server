import Router = require("koa-router");
import User = require("../../controller/user");
import { DefaultState, Context } from 'koa';

const router = new Router<DefaultState, Context>();

router.prefix("/user");

router.get("/getKey", User.getKey);
router.get("/admin/get", User.getUser);

router.post("/register", User.register);
router.post("/admin/add", User.addUser);
router.post("/update", User.updateMyUserInfo);
router.post("/admin/update", User.updateUserAndRole);
router.post("/admin/delete", User.deleteUser);
router.get("/admin/list", User.getUserList);
router.post("/login", User.login);
router.get("/parse/token", User.getTokenUser);
router.post("/logout", User.logout);
router.get("/captcha", User.getSvgCaptcha);
router.get("/my/get", User.getMyUserInfo);
router.post("/my/update", User.updateMyUserInfo);
router.get("/levels", User.getLevelData);

export default router;
