/**
 * HTTP StatusCode を保持できる Errorクラス
 */
class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export default CustomError;
