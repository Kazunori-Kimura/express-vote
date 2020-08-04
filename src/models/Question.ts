import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from './db';
import Choice from './Choice';
import Vote from './Vote';

class Question extends Model {
    public id!: number;
    public question!: string;
    public limit!: Date;
    public createdBy!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public getChoices!: HasManyGetAssociationsMixin<Choice>;
    public getVotes!: HasManyGetAssociationsMixin<Vote>;
}

Question.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        createdBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
    }
);

export default Question;
