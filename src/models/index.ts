import Question from './Question';
import Choice from './Choice';
import Vote from './Vote';
import User from './User';

User.hasMany(Question);
Question.belongsTo(User, {
    foreignKey: 'createdBy',
});

Question.hasMany(Choice);
Choice.belongsTo(Question);

User.hasMany(Vote);
Vote.belongsTo(User, {
    as: 'VotedUser',
    foreignKey: 'votedBy',
});

Question.hasMany(Vote);
Vote.belongsTo(Question);

Choice.hasMany(Vote);
Vote.belongsTo(Choice);

export { Question, Choice, Vote, User };
