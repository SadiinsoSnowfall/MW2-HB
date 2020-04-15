import { Router, Response, NextFunction } from 'express';
import glob from 'glob-promise';
import path from 'path';

import { msg, done, wrap, fileHash } from '../_helpers/utils';
import { FileCache } from '../_helpers/file-cache';

import sanitize from "sanitize-filename";

export const router: Router = Router();

/**
 * ping the server
 */
router.get('/ping', wrap(async function(req: any, res: Response, next: NextFunction) {
    msg(res, 200, "yolo");
}));

/**
 * Get the level data
 */
router.get('/levels/:id', wrap(async function(req: any, res: Response, next: NextFunction) {
    const id = req.params.id;
    const sanitized = sanitize(id);

    if (id !== sanitized) {
        msg(res, 200, "invalid id");
        return;
    }

    const path = `levels/${sanitized}.json`;
    done(res, {
        id: sanitized,
        hash: FileCache.readHash(path),
        data: FileCache.readJSON(path),
    });
}));

/**
 * Get the level list
 */
router.get('/levels', wrap(async function(req: any, res: Response, next: NextFunction) {
    const files = await glob('levels/*.json');
    const hashes = await Promise.all(files.map(f => fileHash(f)));
    done(res, files.map((f, i) => ({ id: path.basename(f, ".json"), hash: hashes[i]})));
}));