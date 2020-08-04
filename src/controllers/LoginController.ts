import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { User } from '../models';
import { IUser } from '../models/User';
import CustomError from '../CustomError';

const SALT_ROUNDS = parseInt(process.env.BC_SALT_ROUNDS || '10', 10);
const SECRET = process.env.APP_SECRET || 'secret';

/**
 * ユーザー登録
 * POST: /signup
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
    try {
        // 入力内容を取得
        const { email, name, password: rawPassword } = req.body;
        // パスワードをハッシュ化
        const password = await hash(rawPassword, SALT_ROUNDS);
        // ユーザーアカウントの作成
        const user = await User.create({ email, name, password });
        // 返却するデータを生成
        const payload = user.toJSON() as IUser;
        delete payload.password;

        res.status(201).json(payload);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // エラーが発生
        const ce = new CustomError(err.message, 400);
        throw ce;
    }
};

/**
 * ユーザー認証
 * POST: /signin
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
    try {
        // 入力内容を取得
        const { email, password: rawPassword } = req.body;
        // メールアドレスを元にユーザーを取得
        const user = await User.findOne({
            where: {
                email,
            },
        });
        if (user) {
            // パスワードを検証
            const match = await compare(rawPassword, user.password);
            if (match) {
                // token生成
                const payload = user.toJSON() as IUser;
                delete payload.password;
                const token = sign(JSON.stringify(payload), SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '30m',
                });
                // 結果を返却
                res.json({ token });
            }
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    // 認証失敗
    const ce = new CustomError('Bad Request', 400);
    throw ce;
};

/**
 * JWTの更新
 * GET: /refresh
 */
export const refresh = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.user) {
            // idを元にユーザーを検索
            const user = await User.findByPk(req.user.id);
            if (user) {
                // token生成
                const payload = user.toJSON() as IUser;
                delete payload.password;
                const token = sign(JSON.stringify(payload), SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '30m',
                });
                // 結果を返却
                res.json({ token });
            }
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    // トークンが生成できない、などの場合は認証失敗とする
    const ce = new CustomError('Unauthenticated', 401);
    throw ce;
};
