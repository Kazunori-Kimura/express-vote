import express, { Request, Response } from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { AuthRouter, QuestionRouter } from './routes';
import CustomError from './CustomError';

const app = express();
app.use(
    cors({
        optionsSuccessStatus: 200,
    })
);
app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());

// routerの設定
app.use('/', AuthRouter);
app.use('/', QuestionRouter);

// エラーハンドラ
app.use((err: Error | CustomError, req: Request, res: Response) => {
    // eslint-disable-next-line no-console
    console.error(err);

    if (err instanceof CustomError) {
        res.status(err.statusCode).send(err.message);
    } else {
        res.status(500).send(err.message);
    }
});

export default app;
