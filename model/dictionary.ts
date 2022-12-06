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
/**
 * 字典
 */
export interface DictionaryAttributes {
    id: number;
    type: string;
    orgId: number;
    orgName: string;
    status: number;
    name: string;
    remark: string;
    deleted: number;
}

export interface DictionaryCreationAttributes
    extends Optional<
        DictionaryAttributes,
        "id" | "type" | "name" | "status" | "orgId" | "orgName" | "remark"
    > {}

class Dictionary
    extends Model<DictionaryAttributes, DictionaryCreationAttributes>
    implements DictionaryAttributes
{
    public id!: number;
    public type!: string;
    public orgId!: number;
    public orgName!: string;
    public status!: number;
    public name!: string;
    public remark!: string;
    public deleted!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Dictionary.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        orgId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        orgName: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        remark: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        deleted: {
            type: DataTypes.INTEGER,
        },
    },
    {
        tableName: "dictionarys",
        sequelize,
    }
);
