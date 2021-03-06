import {
    Model,
    ModelDefined,
    DataTypes,
    Optional,
    Association,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyGetAssociationsMixin,
} from "sequelize";

import sequelize from "./sequelizeConfig";
import Role from "./role";

export interface UserAttributes {
    id: number;
    type: number;
    orgId: number;
    orgName: string;
    avatar: string;
    username: string;
    password: string;
    nickname: string;
    name: string;
    gender: number;
    birth: Date;
    experience: string;
    tel: string;
    email: string;
    address: string;
    deleted: number;
}

export interface UserCreationAttributes
    extends Optional<
        UserAttributes,
        | "id"
        | "orgId"
        | "orgName"
        | "type"
        | "avatar"
        | "nickname"
        | "name"
        | "gender"
        | "birth"
        | "experience"
        | "tel"
        | "email"
        | "address"
        | "deleted"
    > {}

class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public type!: number;
    public orgId!: number;
    public orgName!: string;
    public avatar!: string;
    public username!: string;
    public password!: string;
    public nickname!: string;
    public name!: string;
    public gender!: number;
    public birth!: Date;
    public experience!: string;
    public tel!: string;
    public email!: string;
    public address!: string;
    public deleted!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getRoles!: BelongsToManyGetAssociationsMixin<Role>;
    public addRoles!: BelongsToManyAddAssociationsMixin<Role, []>;
    public setRoles!: BelongsToManySetAssociationsMixin<Role, []>;

    public readonly roles?: Role[];

    public static associations: {
        roles: Association<User, Role>;
    };
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.TINYINT,
        },
        orgId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        // ??????
        orgName: {
            type: DataTypes.STRING(64),
        },
        // ??????
        avatar: {
            type: DataTypes.STRING(64),
        },
        // ?????????
        username: {
            type: DataTypes.STRING(64),
            unique: true,
            allowNull: false,
        },
        // ??????
        password: {
            type: DataTypes.STRING(64),
            allowNull: false,
        },
        // ??????
        nickname: {
            type: DataTypes.STRING(64),
        },
        // ??????
        name: {
            type: DataTypes.STRING(64),
        },
        // ??????
        gender: {
            type: DataTypes.TINYINT,
        },
        // ????????????
        birth: {
            type: DataTypes.DATE,
        },
        // ??????
        experience: {
            type: DataTypes.STRING(32),
        },
        // ????????????
        tel: {
            type: DataTypes.STRING(13),
        },
        // ??????
        email: {
            type: DataTypes.STRING(32),
        },
        // ??????
        address: {
            type: DataTypes.STRING(64),
        },
        deleted: {
            type: DataTypes.TINYINT,
            defaultValue: 0,
        },
    },
    {
        tableName: "users",
        sequelize,
    }
);

export default User;
