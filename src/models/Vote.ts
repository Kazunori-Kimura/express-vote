import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

class Vote extends Model {}

Vote.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        questionId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        choiceId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        votedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

export default Vote;
