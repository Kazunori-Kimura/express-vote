import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

class Vote extends Model {}

Vote.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
    }
);

export default Vote;
