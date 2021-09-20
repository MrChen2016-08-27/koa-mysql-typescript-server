import {
    Model,
    ModelDefined,
    DataTypes,
    Optional
} from 'sequelize';

import sequelize from '../dao/index';

export interface RoleAttributes {
    id: number,
    name: string,
    authority: string | object
}

export interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'>{};

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
    public id!: number;
    public name!: string;
    public authority!: string | object;

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
    name: {
        type: DataTypes.STRING(64),
        unique: true
    },
    authority: {
        type: DataTypes.STRING(64),
    },
}, {
    tableName: 'roles',
    sequelize
});

export default Role;
