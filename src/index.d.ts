// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IUser } from './models/User';

// 認証情報をレスポンスに格納できるように
// Requestのinterfaceを拡張
// node.js - Extend Express Request object using Typescript - Stack Overflow
// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript
declare global {
    namespace Express {
        export interface Request {
            user?: IUser;
        }
    }
}
