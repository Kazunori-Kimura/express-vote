import { User } from '../src/models';

const payload = {
    email: 'kazunori.kimura.js@gmail.com',
    name: 'kazunori kimura',
    password: 'secret',
};

describe('User Model', () => {
    it('ユーザー作成', async () => {
        const user = await User.create(payload);

        expect(user.email).toBe(payload.email);
    });
});
