import mysqlOrm from "./sequelizeConfig";
import User from "./user";
import Role from "./role";
import UserRole from "./userRole";
import Org from "./Org";

(async function () {
    try {
        await mysqlOrm.sync({
            force: false
        });
    } catch (e) {
        console.log("sequelize sync error", e);
    }
});

export default {
    User,
    Role,
    UserRole,
    Org
};
