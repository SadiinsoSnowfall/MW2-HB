import { get, set, del } from 'idb-keyval';
import { http } from './XHRHelper';
import { Scene } from '../scene';
import { PrefabsManager } from './prefabsManager';
import { createGround } from '../../game/prefabs/basePrefabs';
import { Prefab } from '../prefab';

export namespace Levels {

    const serverURL = 'http://localhost:4321';

    interface LevelWrapper {
        id: number,
        hash: string,
        data: LevelData,
    }

    interface LevelData {
        background: number;
        ground: [number, number, number, number][]; // array of (x, y, h, w)
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

        // clear scene
        scene.clear();

        // instantiate all elements
        try {
            for (let i = 0; i < data.ground.length; ++i) {
                const [x, y, w, h] = data.ground[i];
                scene.addObject(createGround(x, y, w, h, "transparent"));
            }

            for (let i = 0; i < data.elements.length; ++i) {
                const [id, x, y] = data.elements[i];
                scene.instantiate(PrefabsManager.get(id), x, y);
            }

            scene.instantiateBackground(PrefabsManager.get(data.background), 0, 0);
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