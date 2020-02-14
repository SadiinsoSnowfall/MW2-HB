import { get, set } from 'idb-keyval';
import * as http from './XHRHelper';

const serverURL = 'localhost:4000';

export async function queryLevel(id: number): Promise<string | null> {
    let level = await get<string>(id);
    if (level === undefined) {
        try {
            level = await getLevelFromServer(id);
        } catch {
            return null;
        }

        set(id, level); // may need to add await there to prevent "race conditions"
    } 

    return level;
}

async function getLevelFromServer(id: number): Promise<string> {
    return await http.get(serverURL + `/levels/${id}`);
}