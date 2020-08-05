import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from './db';
import Choice, { IChoice } from './Choice';
import Vote, { IVote } from './Vote';

export interface IQuestion {
    id: number;
    question: string;
    limit: string;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    choices?: IChoice[];
    votes?: IVote[];
}

class Question extends Model {
    public id!: number;
    public question!: string;
    public limit!: Date;
    public createdBy!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly choices?: Choice[];
    public readonly votes?: Vote[];

    public getChoices!: HasManyGetAssociationsMixin<Choice>;
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
