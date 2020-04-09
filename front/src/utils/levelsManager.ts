import { get, set, del } from 'idb-keyval';
import * as http from './XHRHelper';
import { Scene } from 'src/engine/scene';
import { PrefabsManager } from '../engine/prefabsManager';

const serverURL = 'http://localhost:4321';

export interface LevelData {
    elements: [number, number, number][]; // array of (id, x, y)
}

export async function loadLevel(id: number, scene: Scene): Promise<void> {
    const data = await queryLevel(id);
    if (!data) {
        throw new Error("Unable to load the level " + id);
    }

    // instantiate all elements
    try {
        for (const e of data.elements) {
            scene.instantiate(PrefabsManager.get(e[0]), e[1], e[2]);
        }
    } catch (e) { 
        // invalidate the level cache and rethrow the exception
        invalidateCache(id);
        throw e;
    }
}

export function invalidateCache(id: number) {
    del(id);
}

export async function queryLevel(id: number): Promise<LevelData | null> {
    let level = await get<string>(id); // get from local DB
    if (level === undefined) {
        try {
            level = await getLevelFromServer(id);
        } catch {
            return null;
        }

        set(id, level); // may need to add await there to prevent race conditions
    } 

    return JSON.parse(level);
}

async function getLevelFromServer(id: number): Promise<string> {
    return await http.get(serverURL + `/levels/${id}`);
}