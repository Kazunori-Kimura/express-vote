import { Request, Response, NextFunction } from 'express';
import CustomError from '../CustomError';
import { Question, Choice, Vote } from '../models';
import { IUser } from '../models/User';

/**
 * アンケートを全件返す
 * GET: /question
 */
export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const questions = await Question.findAll({
            include: [
                {
                    model: Choice,
                    as: 'choices',
                },
                {
                    model: Vote,
                    as: 'votes',
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json(questions.map((question) => question.toJSON()));
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        next(ce);
    }
};

/**
 * アンケートの作成
 * POST: /question
 */
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // bodyからデータを取得
        const {
            question,
            limit,
            choices,
        }: {
            question: string;
            limit: string;
            choices: { content: string }[];
        } = req.body;

        // ログインユーザー
        const loginUser = req.app.get('user') as IUser;

        // questionを作成
        const q = await Question.create({
            question,
            limit: new Date(limit),
            createdBy: loginUser.id,
        });
        // choiceを作成
        const questionId = q.id;
        const promises = choices.map(({ content }: { content: string }) => {
            return Choice.create({
                content,
                questionId,
            });
        });
        // 作成完了を待つ
        await Promise.all(promises);

        // 登録データを取得する
        const data = await Question.findByPk(questionId, {
            include: [
                {
                    model: Choice,
                    as: 'choices',
                },
                {
                    model: Vote,
                    as: 'votes',
                },
            ],
        });

        if (data) {
            res.status(201).json(data.toJSON());
            return;
        }

        // 作成失敗
        res.status(500).send('Unknown Error.');
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        next(ce);
    }
};

/**
 * アンケートの削除
 * DELETE: /question/:id
 */
export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const questionId = parseInt(id, 10);
        const question = await Question.findByPk(questionId);
        if (question) {
            await question.destroy({ force: true });
            res.status(204).send('NoContent');
        } else {
            res.status(404).send('NotFound');
            return;
        }
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        next(ce);
    }
};

/**
 * 投票
 * POST: /question/{questionId}/choice/{choiceId}/vote
 */
export const vote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.app.get('user') as IUser;
        const uid = user.id;
        if (uid === 0) {
            // ユーザーIDが取得できない
            res.status(401).send('Unauthorized');
            return;
        }

        const { questionId, choiceId } = req.params;
        const qid = parseInt(questionId, 10);
        const cid = parseInt(choiceId, 10);

        const question = await Question.findByPk(qid);
        const choice = await Choice.findByPk(cid);
        if (question === null || choice === null) {
            // 該当の質問/選択肢が存在しない
            res.status(404).send('NotFound');
            return;
        }

        const now = Date.now();
        const limitTime = new Date(question.limit).getTime();
        if (limitTime < now) {
            // 質問の期限切れ
            res.status(400).send('Bad Request');
            return;
        }

        const voted = await Vote.findOne({
            where: {
                questionId: qid,
                votedBy: uid,
            },
        });
        if (voted) {
            // すでに投票済み
            res.status(409).send('Conflict');
            return;
        }

        const v = await Vote.create({
            questionId: qid,
            choiceId: cid,
            votedBy: uid,
        });

        res.status(201).json(v.toJSON());
    } catch (err) {
        const ce = new CustomError(err.message, 500);
        next(ce);
    }
};
