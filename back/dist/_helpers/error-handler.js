"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
function globalErrorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'invalid-token' });
    }
    return utils_1.unk_err(res, err);
}
exports.globalErrorHandler = globalErrorHandler;
