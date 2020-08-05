/* eslint-disable no-console */
import { User, Question, Choice, Vote } from './models';

// --forceオプションを指定することで
// 全テーブルをdropしてから再作成します
// > npm run migrate -- --force
const force = process.argv.some((arg) => arg === '--force');

const migrate = async () => {
    if (force) {
        await Vote.drop();
        await Choice.drop();
        await Question.drop();
        await User.drop();
    }
    await User.sync({ alter: true });
    await Question.sync({ alter: true });
    await Choice.sync({ alter: true });
    await Vote.sync({ alter: true });
};

migrate()
    .then(() => console.log('データベースの更新が完了しました。'))
    .catch((err) => {
        console.log('データベース更新時にエラーが発生しました。');
        console.error(err);
    })
    .finally(() => process.exit(0));
