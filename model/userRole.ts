import { Model, ModelDefined, DataTypes, Optional } from "sequelize";
import sequelize from "./sequelizeConfig";
import User from "./user";
import Role from "./role";

interface UserRoleAttributes {
    id: number;
}

interface UserRoleCreationAttributes
    extends Optional<UserRoleAttributes, "id"> {}

class UserRole
    extends Model<UserRoleAttributes, UserRoleCreationAttributes>
    implements UserRoleAttributes
{
    public id!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UserRole.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
    },
    {
        tableName: "userRoles",
        sequelize,
    }
);

User.belongsToMany(Role, { through: UserRole, as: "roles" });
Role.belongsToMany(User, { through: UserRole, as: "users" });

export default UserRole;
