import { get, set, del } from 'idb-keyval';
import { http, PrefabsManager } from '.';
import { Scene } from '../scene';

export namespace Levels {

    const serverURL = 'http://localhost:4321';

    interface LevelWrapper {
        id: number,
        hash: string,
        data: LevelData,
    }

    interface LevelData {
        elements: [number, number, number][]; // array of (id, x, y)
    }

    export interface LevelEntry {
        id: number,
        hash: string
    }

    let lvlQueryCalled: boolean = false;
    let levelList: LevelEntry[] = [];

    export async function queryLevelList(): Promise<LevelEntry[]> {
        lvlQueryCalled = true;
        
        // query list
        levelList = await http.json<LevelEntry[]>(serverURL + '/levels');
        
        // verify checksum & invalidate if needed
        for (let i = 0; i < levelList.length; ++i) {
            const shash = await get<string>(`${levelList[i].id}.hash`);
            if ((shash !== undefined) && (shash !== levelList[i].hash)) {
                invalidateCache(levelList[i].id);
            }
        }

        return levelList;
    }

    export function querylvlCalled(): boolean {
        return lvlQueryCalled;
    }

    export async function getOrQueryLevelList(): Promise<LevelEntry[]> {
        if (lvlQueryCalled) {
            return levelList;
        } else {
            return await queryLevelList();
        }
    }

    export function getLevelList(): LevelEntry[] {
        return levelList;
    }

    export async function loadLevel(id: number, scene: Scene): Promise<void> {
        const data = await queryLevel(id);
        if (!data) {
            throw new Error("Unable to load the level " + id);
        }

        // instantiate all elements
        try {
            for (let i = 0; i < data.elements.length; ++i) {
                const e = data.elements[i];
                scene.instantiate(PrefabsManager.get(e[0]), e[1], e[2]);
            }
        } catch (e) { 
            // invalidate the level cache and rethrow the exception
            invalidateCache(id);
            throw e;
        }
    }

    export function invalidateCache(id: number) {
        del(`${id}.data`);
        del(`${id}.hash`);
    }

    export async function queryLevel(id: number): Promise<LevelData | null> {
        const stored = await get<LevelData>(`${id}.data`); // get from local DB
        if (stored === undefined) {
            try {
                const wrapper = await http.json<LevelWrapper>(serverURL + `/levels/${id}`);
                
                // may need to add await there to prevent race conditions
                set(`${id}.hash`, wrapper.hash);
                set(`${id}.data`, wrapper.data); 

                return wrapper.data;
            } catch {
                return null;
            }
        } else {
            return stored;
        }
    }

}