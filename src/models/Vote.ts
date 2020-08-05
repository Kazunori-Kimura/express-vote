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
        questionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        choiceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        votedBy: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

export default Vote;
