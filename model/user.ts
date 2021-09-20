import {
    Model,
    ModelDefined,
    DataTypes,
    Optional,
    Association,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyGetAssociationsMixin
} from 'sequelize';

import sequelize from '../dao/index';
import Role from './role';

export interface UserAttributes {
    id: number,
    avatar: string,
    username: string,
    password: string,
    nickname: string,
    gender: number,
    birth: Date,
    experience: string,
    mobile: string,
    email: string,
    address: string,
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'gender' | 'birth' | 'experience' | 'mobile' | 'email' | 'address'>{};

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes{
    public id!: number;
    public avatar!: string;
    public username!: string;
    public password!: string;
    public nickname!: string;
    public gender!: number;
    public birth!: Date;
    public experience!: string;
    public mobile!: string;
    public email!: string;
    public address!: string;

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


User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    // 头像
    avatar: {
        type: DataTypes.STRING(64)
    },
    // 用户名
    username: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
    },
    // 密码
    password: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    // 昵称
    nickname: {
        type: DataTypes.STRING(64),
    },
    // 性别
    gender: {
        type: DataTypes.INTEGER
    },
    // 出生年月
    birth: {
        type: DataTypes.DATE
    },
    // 经验
    experience: {
        type: DataTypes.STRING(32)
    },
    // 手机号码
    mobile: {
        type: DataTypes.STRING(13),
    },
    // 邮箱
    email: {
        type: DataTypes.STRING(32)
    },
    // 地址
    address: {
        type: DataTypes.STRING(64)
    }
}, {
    tableName: 'users',
    sequelize
});






export default User;