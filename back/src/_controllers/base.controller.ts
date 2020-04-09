import { Router, Response, NextFunction } from 'express';

import { msg, done, wrap } from '../_helpers/utils';
import { FileCache } from '../_helpers/file-cache';

import sanitize from "sanitize-filename";

export const router: Router = Router();

/**
 * ping the server
 */
router.get('/ping', wrap(async function(req: any, res: Response, next: NextFunction) {
    msg(res, 200, "pong");
}));

router.get('/levels/:id', wrap(async function(req: any, res: Response, next: NextFunction) {
    const id = req.params.id; // force cast to number
    const sanitized = sanitize(id);

    if (id !== sanitized) {
        msg(res, 200, "invalid id");
        return;
    }

    done(res, FileCache.readJSON(`levels/${sanitized}.json`));
}));

