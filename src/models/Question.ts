import { Model, DataTypes } from 'sequelize';
import sequelize from './db';

class Question extends Model {
    public id!: number;
    public question!: string;
    public limit!: Date;
    public createdBy!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        limit: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

export default Question;
