import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

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
