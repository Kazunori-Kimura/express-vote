import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

/**
 * 認証トークンに含めるJSONの型定義
 */
export interface IUser {
    id: number;
    email: string;
    name: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class User extends Model {
    public id!: number;
    public email!: string;
    public name!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

export default User;
