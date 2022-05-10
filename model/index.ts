import mysqlOrm from "../dao/index";
import User from "./user";
import Role from "./role";
import UserRole from "./userRole";

(async function () {
    try {
        await mysqlOrm.sync();
    } catch (e) {
        console.log("sequelize sync error", e);
    }
});

export default {
    User,
    Role,
    UserRole,
};
