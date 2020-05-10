"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const glob_promise_1 = __importDefault(require("glob-promise"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../_helpers/utils");
const file_cache_1 = require("../_helpers/file-cache");
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
exports.router = express_1.Router();
exports.router.get('/ping', utils_1.wrap(async function (req, res, next) {
    utils_1.msg(res, 200, "yolo");
}));
exports.router.get('/levels/:id', utils_1.wrap(async function (req, res, next) {
    const id = req.params.id;
    const sanitized = sanitize_filename_1.default(id);
    if (id !== sanitized) {
        utils_1.msg(res, 200, "invalid id");
        return;
    }
    const path = `levels/${sanitized}.json`;
    utils_1.done(res, {
        id: sanitized,
        hash: file_cache_1.FileCache.readHash(path),
        data: file_cache_1.FileCache.readJSON(path),
    });
}));
exports.router.get('/levels', utils_1.wrap(async function (req, res, next) {
    const files = await glob_promise_1.default('levels/*.json');
    const hashes = await Promise.all(files.map(f => utils_1.fileHash(f)));
    utils_1.done(res, files.map((f, i) => ({ id: path_1.default.basename(f, ".json"), hash: hashes[i] })));
}));
