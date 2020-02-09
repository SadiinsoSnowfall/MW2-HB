import fs = require('fs');

export class FileCache {
    static cache = new Map<string, [string | undefined, object | undefined]>();

    private static getCache(path: string): [string | undefined, object | undefined] {
        if(FileCache.cache.has(path)) {
            return FileCache.cache.get(path) as [string, object];
        } else {
            return [undefined, undefined];
        }
    }

    public static readJSON(path: string, keepRaw: boolean = false): any {
        const [str, obj] = FileCache.getCache(path);
        
        if(obj) {
            return obj;
        } else {
            if(str) {
                const nobj: object = Object.freeze(JSON.parse(str));
                FileCache.cache.set(path, [str, nobj]);
                return nobj;
            } else {
                const contents = fs.readFileSync(path, 'utf-8').trim(), nobj = Object.freeze(JSON.parse(contents));
                FileCache.cache.set(path, [keepRaw ? contents : undefined, nobj]);
                return nobj;
            }  
        }
    }

    public static read(path: string, alowStringify: boolean = true): string {
        const [str, obj] = FileCache.getCache(path);

        if(str) {
            return str;
        } else {
            if(obj && alowStringify) {
               const nstr = Object.freeze(JSON.stringify(obj));
               FileCache.cache.set(path, [nstr, obj])
               return nstr;
            } else {
                const contents = Object.freeze(fs.readFileSync(path, 'utf-8').trim());
                FileCache.cache.set(path, [contents, obj]);
                return contents;
            }
        }
    }

}