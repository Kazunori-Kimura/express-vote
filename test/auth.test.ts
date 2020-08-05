import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models';

const auth = {
    id: 0,
    email: 'kimura-kazunori@example.com',
    name: 'Kimura Kazunori',
    password: 'secret',
    token: '',
};

// POST: /signup
describe('POST: /signup', () => {
    // あらかじめテストユーザーのデータを削除する
    beforeAll(async () => {
        const user = await User.findOne({ where: { email: auth.email } });
        if (user) {
            user.destroy();
        }
    });

    it('ユーザー作成', async () => {
        const response = await request(app).post('/signup').send({
            email: auth.email,
            name: auth.name,
            password: auth.password,
        });

        auth.id = response.body.id;
        expect(response.status).toBe(201);
    });
});

// POST: /signin
describe('POST: /signin', () => {
    it('認証失敗', async () => {
        const response = await request(app).post('/signin').send({
            email: auth.email,
            password: 'password',
        });

        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('token');
    });

    it('認証成功', async () => {
        const response = await request(app).post('/signin').send({
            email: auth.email,
            password: auth.password,
        });

        auth.token = response.body.token;
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});

// GET: /refresh
describe('GET: /refresh', () => {
    it('トークン更新', async () => {
        const response = await request(app)
            .get('/refresh')
            .set('Authorization', `Bearer ${auth.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
