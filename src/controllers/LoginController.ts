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
        const {
            email,
            name,
            password: rawPassword,
        }: {
            email: string;
            name: string;
            password: string;
        } = req.body;

        // 入力値のいずれかが空なら 400 BadRequest で終了
        if (email.length === 0 || name.length === 0 || rawPassword.length === 0) {
            res.status(400).send('BadRequest');
            return;
        }

        // 登録済みのメールアドレスなら 409 Conflict
        const u = await User.findAll({
            where: {
                email,
            },
        });
        if (u.length > 0) {
            res.status(409).send('Conflict');
            return;
        }

        // パスワードをハッシュ化
        const password = await hash(rawPassword, SALT_ROUNDS);
        // ユーザーアカウントの作成
        const user = await User.create({ email, name, password });
        // 返却するデータを生成
        const payload = user.toJSON() as IUser;
        delete payload.password;

        res.status(201).json(payload);
    } catch (err) {
        // エラーが発生
        const ce = new CustomError(err.message, 500);
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
        const {
            email,
            password: rawPassword,
        }: {
            email: string;
            password: string;
        } = req.body;

        // 入力値のいずれかが空なら 400 BadRequest で終了
        if (email.length === 0 || rawPassword.length === 0) {
            res.status(400).send('BadRequest');
            return;
        }

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
                const token = sign(payload, SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '30m',
                });
                // 結果を返却
                res.json({ token });
                return;
            }
        }

        // 認証失敗
        res.status(401).send('Unauthorized');
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        throw ce;
    }
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
                const token = sign(payload, SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '30m',
                });
                // 結果を返却
                res.json({ token });
                return;
            }
        }

        // userが取得できないなどの理由でトークンが生成できない
        res.status(401).send('Unauthorized');
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        throw ce;
    }
};

/**
 * ユーザーの削除
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const uid = parseInt(id, 10);
        const user = await User.findByPk(uid);
        if (user) {
            user.destroy();
            res.status(204).send('NoContent');
            return;
        }

        // 該当ユーザー無し
        res.status(404).send('NotFound');
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        throw ce;
    }
};
