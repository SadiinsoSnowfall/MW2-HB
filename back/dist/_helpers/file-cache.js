"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
class FileCache {
    static getCache(path) {
        if (FileCache.cache.has(path)) {
            return FileCache.cache.get(path);
        }
        else {
            return [undefined, undefined, undefined];
        }
    }
    static readHash(path) {
        const [str, obj, hash] = FileCache.getCache(path);
        if (hash) {
            return hash;
        }
        else {
            const contents = Object.freeze(fs_1.default.readFileSync(path, 'utf-8').trim());
            const newhash = crypto_1.default.createHash('md5').update(contents).digest('base64');
            FileCache.cache.set(path, [contents, obj, newhash]);
            return newhash;
        }
    }
    static readJSON(path, keepRaw = false) {
        const [str, obj, hash] = FileCache.getCache(path);
        if (obj) {
            return obj;
        }
        else {
            if (str) {
                const nobj = Object.freeze(JSON.parse(str));
                FileCache.cache.set(path, [str, nobj, hash]);
                return nobj;
            }
            else {
                const contents = fs_1.default.readFileSync(path, 'utf-8').trim();
                const nobj = Object.freeze(JSON.parse(contents));
                const newhash = crypto_1.default.createHash('sha1').update(contents).digest('base64');
                FileCache.cache.set(path, [keepRaw ? contents : undefined, nobj, newhash]);
                return nobj;
            }
        }
    }
    static read(path, alowStringify = true) {
        const [str, obj, hash] = FileCache.getCache(path);
        if (str) {
            return str;
        }
        else {
            if (obj && alowStringify) {
                const nstr = Object.freeze(JSON.stringify(obj));
                FileCache.cache.set(path, [nstr, obj, hash]);
                return nstr;
            }
            else {
                const contents = Object.freeze(fs_1.default.readFileSync(path, 'utf-8').trim());
                const newhash = crypto_1.default.createHash('md5').update(contents).digest('base64');
                FileCache.cache.set(path, [contents, obj, newhash]);
                return contents;
            }
        }
    }
}
exports.FileCache = FileCache;
FileCache.cache = new Map();
