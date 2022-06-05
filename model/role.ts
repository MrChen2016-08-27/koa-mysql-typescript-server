import {
    Model,
    ModelDefined,
    DataTypes,
    Optional
} from 'sequelize';

import sequelize from './sequelizeConfig';

export interface RoleAttributes {
    id: number,
    name: string,
    authority: string | object,
    status: number,
    remark: string,
    deleted: number
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'remark' | 'status' | 'deleted'>{};

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;
    public authority!: string | object;
    public status!: number;
    public remark!: string;
    public deleted!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

}

Role.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    // 角色名称
    name: {
        type: DataTypes.STRING(64),
        unique: true
    },
    // 角色权限
    authority: {
        type: DataTypes.STRING(64),
    },
    // 状态
    status: {
        type: DataTypes.TINYINT,
    },
    // 备注
    remark: {
        type: DataTypes.STRING(64),
    },
    deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0
    },
}, {
    tableName: 'roles',
    sequelize
});

export default Role;