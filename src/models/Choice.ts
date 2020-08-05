import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

export interface IChoice {
    id: number;
    content: string;
}

class Choice extends Model {}

Choice.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

export default Choice;
