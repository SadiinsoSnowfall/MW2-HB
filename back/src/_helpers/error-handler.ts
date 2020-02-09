import { Response, NextFunction } from 'express';
import { unk_err } from './utils';

export function globalErrorHandler(err: any, req: any, res: Response, next: NextFunction) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'invalid-token' });
    }

    // default to 500 server error
    return unk_err(res, err);
}