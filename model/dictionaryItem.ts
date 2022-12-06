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

export interface DictionaryItemAttributes {
    id: number;
    createBy: string;
    value: string;
    default: boolean;
    dictCode: number;
    label: string;
    dictSort: number;
    dictType: string;
    isDefault: string;
    listClass: string;
    remark: string;
    updateBy: string;
    status: number;
    deleted: number;
}

export interface DictionaryItemCreationAttributes
    extends Optional<
        DictionaryItemAttributes,
        | "id"
        | "createBy"
        | "value"
        | "default"
        | "dictCode"
        | "label"
        | "dictSort"
        | "dictType"
        | "isDefault"
        | "listClass"
        | "remark"
        | "updateBy"
        | "status"
        | "deleted"
    > {}

class DictionaryItem
    extends Model<DictionaryItemAttributes, DictionaryItemCreationAttributes>
    implements DictionaryItemAttributes
{
    public id!: number;
    public createBy!: string;
    public value!: string;
    public default!: boolean;
    public dictCode!: number;
    public label!: string;
    public dictSort!: number;
    public dictType!: string;
    public isDefault!: string;
    public listClass!: string;
    public remark!: string;
    public updateBy!: string;
    public status!: number;
    public deleted!: number;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

DictionaryItem.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        createBy: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.STRING,
        },
        default: {
            type: DataTypes.BOOLEAN,
        },
        dictCode: {
            type: DataTypes.STRING,
        },
        label: {
            type: DataTypes.STRING,
        },
        dictSort: {
            type: DataTypes.INTEGER,
        },
        dictType: {
            type: DataTypes.STRING,
        },
        isDefault: {
            type: DataTypes.STRING,
        },
        listClass: {
            type: DataTypes.STRING,
        },
        remark: {
            type: DataTypes.STRING,
        },
        updateBy: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        deleted: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        tableName: "dictionaryItems",
        sequelize,
    }
);
