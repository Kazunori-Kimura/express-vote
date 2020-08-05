import request from 'supertest';
import app from '../src/app';

const auth = {
    email: 'kazunori.kimura.js@gmail.com',
    name: 'kazunori kimura',
    password: 'secret',
    token: '',
};

// POST: /signup
describe('POST: /signup', () => {
    it('ユーザー作成', async () => {
        const response = await request(app).post('/signup').send({
            email: auth.email,
            name: auth.name,
            password: auth.password,
        });

        expect(response.status).toBe(201);
    });
});

// POST: /signin
// describe('POST: /signin', () => {
//     it('認証失敗', async () => {
//         const response = await request(app).post('/signin').send({
//             email: auth.email,
//             password: 'password',
//         });

//         expect(response.status).toBe(401);
//     });

//     it('認証成功', async () => {
//         const response = await request(app).post('/signin').send({
//             email: auth.email,
//             password: auth.password,
//         });

//         expect(response.status).toBe(200);
//     });
// });

// GET: /refresh

// DELETE: /user/:id
