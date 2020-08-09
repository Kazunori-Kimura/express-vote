import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models';
import { IChoice } from '../src/models/Choice';
import { IQuestion } from '../src/models/Question';
import { IVote } from '../src/models/Vote';

// 認証情報
const auth = {
    id: 0,
    email: 'kimura-kazunori+question@example.com',
    name: 'Kimura Kazunori',
    password: 'secret',
    token: '',
};

// 送信データ
const postData = {
    question: 'hoge',
    limit: new Date('2025-08-01T00:00:00.000Z').toJSON(),
    choices: [{ content: 'foo' }, { content: 'bar' }],
};

// 受信データ
interface IRecvData {
    questionId: number;
    choiceIds: number[];
    voteId: number;
}
const recvData: IRecvData = {
    questionId: 0,
    choiceIds: [],
    voteId: 0,
};

describe('question API', () => {
    // ログイン処理を行う
    beforeAll(async () => {
        // ユーザーが存在する？
        const user = await User.findOne({ where: { email: auth.email } });
        if (user) {
            auth.id = user.id;
        } else {
            // ユーザー作成
            const response = await request(app).post('/signup').send({
                email: auth.email,
                name: auth.name,
                password: auth.password,
            });
            auth.id = response.body.id;
        }

        // ログイン処理
        const response = await request(app).post('/signin').send({
            email: auth.email,
            password: auth.password,
        });
        // tokenを保持する
        auth.token = response.body.token;
    });

    // POST: /question
    it('POST: /question', async () => {
        const response = await request(app)
            .post('/question')
            .send(postData)
            .set('Authorization', `Bearer ${auth.token}`);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        // 登録ユーザーIDの確認
        expect(response.body).toHaveProperty('createdBy', auth.id);

        // 登録データを保持する
        recvData.questionId = response.body.id;
        const { choices } = response.body;
        recvData.choiceIds = choices.map((choice: IChoice) => choice.id);
    });

    // GET: /question
    it('GET: /question', async () => {
        const response = await request(app).get('/question');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // POSTで作成した要素を含むか？
        const questions = response.body as IQuestion[];
        const question = questions.find((q) => q.id === recvData.questionId);
        expect(question).toBeDefined();
        expect(question?.choices).toHaveLength(postData.choices.length);
    });

    // POST: /question/:questionId/choice/:choiceId/vote
    it('POST: vote', async () => {
        const response = await request(app)
            .post(`/question/${recvData.questionId}/choice/${recvData.choiceIds[0]}/vote`)
            .set('Authorization', `Bearer ${auth.token}`);

        expect(response.status).toBe(201);
        // 投票ユーザーIDが正しくセットされているか
        expect(response.body).toHaveProperty('votedBy', auth.id);
        // voteのidを保持
        const vote = response.body as IVote;
        recvData.voteId = vote.id;
    });

    it('同じアンケートには回答できない', async () => {
        const response = await request(app)
            .post(`/question/${recvData.questionId}/choice/${recvData.choiceIds[0]}/vote`)
            .set('Authorization', `Bearer ${auth.token}`);

        expect(response.status).toBe(409);
    });

    it('投票結果の取得', async () => {
        const response = await request(app).get('/question');

        expect(response.status).toBe(200);
        // voteした要素を含むか？
        const questions = response.body as IQuestion[];
        const question = questions.find((q) => q.id === recvData.questionId);
        const vote = question?.votes?.find((v) => v.id === recvData.voteId);
        expect(vote).toBeDefined();
        expect(vote).toHaveProperty('votedBy', auth.id);
    });

    // DELETE: /question/:id
    it('DELETE: /question/:id', async () => {
        const response = await request(app)
            .delete(`/question/${recvData.questionId}`)
            .set('Authorization', `Bearer ${auth.token}`);

        expect(response.status).toBe(204);
    });
});
