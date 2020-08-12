import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import CustomError from '../CustomError';
import User, { IUser } from '../models/User';

const SECRET = process.env.APP_SECRET || 'secret';

/**
 * ヘッダーよりJWTのトークンを取得して認証を行います。
 * 認証したユーザー情報をrequestにセットします。
 */
const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // リクエストヘッダーからトークンを取得
        const token = req.headers.authorization?.replace(/^bearer\s/i, '');
        if (token) {
            // トークンから認証情報を取得
            const payload = verify(token, SECRET) as IUser;
            const { id } = payload;
            // idを元にユーザーを検索
            const user = await User.findByPk(id);
            const data = user?.toJSON() as IUser;
            req.app.set('user', data);
            next();
            return;
        }
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
    }

    // トークンが取得できない、トークンから認証情報を取得する
    // 際に例外が発生した、などの場合は認証失敗とする
    const ce = new CustomError('Unauthenticated', 401);
    next(ce);
};

export default authenticate;
