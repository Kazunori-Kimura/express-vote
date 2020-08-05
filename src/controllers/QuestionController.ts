import { Request, Response } from 'express';
import CustomError from '../CustomError';
import { Question, Choice, Vote } from '../models';

/**
 * アンケートを全件返す
 * GET: /question
 */
export const list = async (req: Request, res: Response): Promise<void> => {
    try {
        const questions = await Question.findAll({
            include: [Choice, Vote],
        });
        res.json(questions.map((item) => item.toJSON()));
    } catch (err) {
        const e = err as Error;
        const ce = new CustomError(e.message, 500);
        throw ce;
    }
};

/**
 * アンケートの作成
 * POST: /question
 */
export const create = async (req: Request, res: Response): Promise<void> => {
    try {
        // bodyからデータを取得
        const { question, limit, choices } = req.body;
        // ログインユーザーID
        const userId = req.user?.id || 0;

        // questionを作成
        const q = await Question.create(
            {
                question,
                limit: new Date(limit),
                createdBy: userId,
                choices,
            },
            {
                include: [Choice],
            }
        );

        res.status(201).json(q.toJSON());
    } catch (err) {
        const e = err as Error;
        const ce = new CustomError(e.message, 500);
        throw ce;
    }
};

/**
 * アンケートの削除
 * DELETE: /question/:id
 */
export const remove = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const questionId = parseInt(id, 10);
        const question = await Question.findByPk(questionId);
        if (question) {
            await question.destroy();
            res.status(204).json({ message: 'No Content' });
        } else {
            const err = new CustomError('NotFound', 404);
            throw err;
        }
    } catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }

        const e = err as Error;
        const ce = new CustomError(e.message, 500);
        throw ce;
    }
};

/**
 * 投票
 * POST: /question/{questionId}/choice/{choiceId}/vote
 */
export const vote = async (req: Request, res: Response): Promise<void> => {
    try {
        const uid = req.user?.id || 0;
        if (uid === 0) {
            const err = new CustomError('Unauthorized', 401);
            throw err;
        }

        const { questionId, choiceId } = req.params;
        const qid = parseInt(questionId, 10);
        const cid = parseInt(choiceId, 10);

        const choice = await Choice.findByPk(cid);
        if (choice) {
            const voted = await Vote.findOne({
                where: {
                    questionId: qid,
                    votedBy: uid,
                },
            });
            if (voted) {
                // すでに投票済み
                const err = new CustomError('Conflict', 409);
                throw err;
            }

            const v = await Vote.create({
                questionId: qid,
                choiceId: cid,
                votedBy: uid,
            });

            res.status(201).json(v.toJSON());
        } else {
            const err = new CustomError('NotFound', 404);
            throw err;
        }
    } catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }

        const e = err as Error;
        const ce = new CustomError(e.message, 500);
        throw ce;
    }
};
