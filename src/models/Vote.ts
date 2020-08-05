import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

export interface IVote {
    id: number;
    votedBy: number;
}

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
