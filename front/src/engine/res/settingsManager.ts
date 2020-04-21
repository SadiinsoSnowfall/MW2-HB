import { get as dbGet, set as dbSet, del as dbDel } from 'idb-keyval';

export namespace Settings {

    export async function set(key: string | DefaultSettings, value: any): Promise<void> {
        return dbSet(`ss-${key}`, value);
    }

    export async function get<T>(key: string | DefaultSettings, dvalue: T | undefined = undefined): Promise<T | undefined> {
        const res =  await dbGet<T>(`ss-${key}`);
        return res === undefined ? dvalue : res;
    }

    export async function isset(key: string | DefaultSettings): Promise<boolean> {
        return (await dbGet(`ss-${key}`)) !== undefined;
    }

    export async function del(key: string | DefaultSettings): Promise<void> {
        return dbDel(`ss-${key}`)
    }

    export async function getOrSet<T>(key: string | DefaultSettings, dvalue: T): Promise<T> {
        const res = await get<T>(key);
        if (res !== undefined) {
            return res;
        } else {
            await set(key, dvalue);
            return dvalue;
        }
    }

    export async function toggle(key: string | DefaultSettings, dvalue: boolean): Promise<boolean> {
        const pkey = `ss-${key}`;
        const res = await dbGet<boolean>(pkey);
        if (res === undefined) {
            await dbSet(pkey, dvalue);
            return dvalue;
        } else {
            await dbSet(pkey, !res);
            return !res;
        }
    }

}

export enum DefaultSettings {
    SOUND_ENABLED
}