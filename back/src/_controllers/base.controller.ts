import { Router, Response, NextFunction } from 'express';
import { param, check, body } from 'express-validator';

import { check_errors, status, msg, forbidden, done, wrap } from '../_helpers/utils';

export const router: Router = Router();

/**
 * Retrieve all comments
 */
router.get('/ping', wrap(async function(req: any, res: Response, next: NextFunction) {
    msg(res, 200, "pong");
}));