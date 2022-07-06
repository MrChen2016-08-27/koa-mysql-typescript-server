import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    Optional,
} from "sequelize";
import sequelize from "./sequelizeConfig";

export interface OrgAttributes {
    id: number;
    name: string;
    type: number;
    sn: string;
    depth: number;
    code: string;
    address: string;
    licenseSn: string;
    corporate: string;
    contact: string;
    tel: string;
    fax: string;
    parentId: number;
    seq: string;
    longitude: string;
    latitude: string;
    status: number;
    remark: string;
    props: Text;
    deleted: number;
    parentName: string;
}

export interface OrgCreationAttributes
    extends Optional<
        OrgAttributes,
        | "id"
        | "type"
        | "sn"
        | "depth"
        | "code"
        | "address"
        | "licenseSn"
        | "corporate"
        | "contact"
        | "tel"
        | "fax"
        | "parentId"
        | "seq"
        | "longitude"
        | "latitude"
        | "status"
        | "remark"
        | "props"
    > {}

class Org
    extends Model<OrgAttributes, OrgCreationAttributes>
    implements OrgAttributes
{
    public id!: number;
    public name!: string;
    public type!: number;
    public sn!: string;
    public depth!: number;
    public code!: string;
    public address!: string;
    public licenseSn!: string;
    public corporate!: string;
    public contact!: string;
    public tel!: string;
    public fax!: string;
    public parentId!: number;
    public seq!: string;
    public longitude!: string;
    public latitude!: string;
    public status!: number;
    public remark!: string;
    public props!: Text;
    public deleted!: number;
    public parentName!: string;

    public children?: Org[];

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Org.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: '组织架构名称不能为空'
                },   
            }
        },
        type: {
            type: DataTypes.INTEGER,
        },
        sn: {
            type: DataTypes.STRING,
        },
        depth: {
            type: DataTypes.INTEGER,
        },
        code: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.STRING,
        },
        licenseSn: {
            type: DataTypes.STRING,
        },
        corporate: {
            type: DataTypes.STRING,
        },
        contact: {
            type: DataTypes.STRING(32),
        },
        tel: {
            type: DataTypes.STRING(32),
        },
        fax: {
            type: DataTypes.STRING,
        },
        parentId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        seq: {
            type: DataTypes.STRING,
        },
        longitude: {
            type: DataTypes.STRING(32),
        },
        latitude: {
            type: DataTypes.STRING(32),
        },
        status: {
            type: DataTypes.INTEGER,
        },
        remark: {
            type: DataTypes.STRING,
        },
        props: {
            type: DataTypes.TEXT,
        },
        deleted: {
            type: DataTypes.TINYINT,
            defaultValue: 0
        },
        parentName: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "orgs",
        sequelize,
    }
);

export default Org;
