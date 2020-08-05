import Question from './Question';
import Choice from './Choice';
import Vote from './Vote';
import User from './User';

// User <-> Question
User.hasMany(Question, {
    foreignKey: 'createdBy',
    onDelete: 'cascade',
    hooks: true,
});
Question.belongsTo(User, {
    foreignKey: 'createdBy',
});
// User <-> Vote
User.hasMany(Vote, {
    foreignKey: 'votedBy',
    onDelete: 'cascade',
    hooks: true,
});
Vote.belongsTo(User, {
    foreignKey: 'votedBy',
});
// Question <-> Choice
Question.hasMany(Choice, {
    foreignKey: 'questionId',
    as: 'choices',
    onDelete: 'cascade',
    hooks: true,
});
Choice.belongsTo(Question, {
    foreignKey: 'questionId',
});
// Question <-> Vote
Question.hasMany(Vote, {
    foreignKey: 'questionId',
    as: 'votes',
    onDelete: 'cascade',
    hooks: true,
});
Vote.belongsTo(Question, {
    foreignKey: 'questionId',
});
// Choice <-> Vote
Choice.hasMany(Vote, {
    foreignKey: 'choiceId',
    as: 'votes',
});
Vote.belongsTo(Choice, {
    foreignKey: 'choiceId',
});

export { Question, Choice, Vote, User };
