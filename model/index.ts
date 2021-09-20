
import mysqlOrm from "../dao/index";
import User from './user';
import Role from './role';
import UserRole from './userRole';

mysqlOrm.sync();

export default {
    User,
    Role,
    UserRole
}