import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

import crypto from 'crypto';
import fs from 'fs';

export function generate_token(len: number): string {
    return Buffer.from(crypto.randomBytes(len)).toString('base64').replace(/\+/g, '').replace(/\//g, '').replace(/=+$/, '').substr(0, len);
}

export function status(res: Response, status: number, obj?: object): any {
    if (obj) {
        return res.status(status).json(obj);
    } else {
        return res.status(status);
    }
}

export function msg(res: Response, _status: number, message: string, data?: object): any {
    status(res, _status, data ? { message: message, data: data } : { message: message });
}

export function unk_err(res: Response, err: Error, log: boolean = true): void {
    if (log) {
        console.error(err);
    }

    msg(res, 500, 'internal-error');
}

export function forbidden(res: Response): void {
    status(res, 403);
}

export function done(res: Response, data?: object): void {
    status(res, 200, data);
}

export function check_errors(req: any, res: Response, next: NextFunction): any {
    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
        next();
    } else {
        exports.status(res, 422, { errors: errors.array() });
    }
}

export function wrap(route: Function) {
    return (req: any, res: Response, next: NextFunction) => Promise.resolve(route(req, res, next)).catch(next);
}

export function fileHash(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const rs = fs.createReadStream(path);
        rs.on('error', reject);
        rs.on('end', () => resolve(hash.digest('base64')));
        rs.pipe(hash);
    });
}