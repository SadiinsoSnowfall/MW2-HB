import fs from 'fs';
import crypto from 'crypto';

export class FileCache {
    static cache = new Map<string, [string | undefined, object | undefined, string | undefined]>();

    private static getCache(path: string): [string | undefined, object | undefined, string | undefined] {
        if(FileCache.cache.has(path)) {
            return FileCache.cache.get(path) as [string, object, string];
        } else {
            return [undefined, undefined, undefined];
        }
    }

    public static readHash(path: string): string {
        const [str, obj, hash] = FileCache.getCache(path);
        if (hash) {
            return hash;
        } else {
            const contents = Object.freeze(fs.readFileSync(path, 'utf-8').trim());
            const newhash = crypto.createHash('md5').update(contents).digest('base64');
            FileCache.cache.set(path, [contents, obj, newhash]);
            return newhash;
        }
    }

    public static readJSON(path: string, keepRaw: boolean = false): any {
        const [str, obj, hash] = FileCache.getCache(path);
        
        if(obj) {
            return obj;
        } else {
            if(str) {
                const nobj: object = Object.freeze(JSON.parse(str));
                FileCache.cache.set(path, [str, nobj, hash]);
                return nobj;
            } else {
                const contents = fs.readFileSync(path, 'utf-8').trim();
                const nobj = Object.freeze(JSON.parse(contents));
                const newhash = crypto.createHash('sha1').update(contents).digest('base64');
                FileCache.cache.set(path, [keepRaw ? contents : undefined, nobj, newhash]);
                return nobj;
            }  
        }
    }

    public static read(path: string, alowStringify: boolean = true): string {
        const [str, obj, hash] = FileCache.getCache(path);

        if(str) {
            return str;
        } else {
            if(obj && alowStringify) {
               const nstr = Object.freeze(JSON.stringify(obj));
               FileCache.cache.set(path, [nstr, obj, hash])
               return nstr;
            } else {
                const contents = Object.freeze(fs.readFileSync(path, 'utf-8').trim());
                const newhash = crypto.createHash('md5').update(contents).digest('base64');
                FileCache.cache.set(path, [contents, obj, newhash]);
                return contents;
            }
        }
    }

}