"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
function generate_token(len) {
    return Buffer.from(crypto_1.default.randomBytes(len)).toString('base64').replace(/\+/g, '').replace(/\//g, '').replace(/=+$/, '').substr(0, len);
}
exports.generate_token = generate_token;
function status(res, status, obj) {
    if (obj) {
        return res.status(status).json(obj);
    }
    else {
        return res.status(status);
    }
}
exports.status = status;
function msg(res, _status, message, data) {
    status(res, _status, data ? { message: message, data: data } : { message: message });
}
exports.msg = msg;
function unk_err(res, err, log = true) {
    if (log) {
        console.error(err);
    }
    msg(res, 500, 'internal-error');
}
exports.unk_err = unk_err;
function forbidden(res) {
    status(res, 403);
}
exports.forbidden = forbidden;
function done(res, data) {
    status(res, 200, data);
}
exports.done = done;
function check_errors(req, res, next) {
    const errors = express_validator_1.validationResult(req);
    if (errors.isEmpty()) {
        next();
    }
    else {
        exports.status(res, 422, { errors: errors.array() });
    }
}
exports.check_errors = check_errors;
function wrap(route) {
    return (req, res, next) => Promise.resolve(route(req, res, next)).catch(next);
}
exports.wrap = wrap;
function fileHash(path) {
    return new Promise((resolve, reject) => {
        const hash = crypto_1.default.createHash('md5');
        const rs = fs_1.default.createReadStream(path);
        rs.on('error', reject);
        rs.on('end', () => resolve(hash.digest('base64')));
        rs.pipe(hash);
    });
}
exports.fileHash = fileHash;
