import { Prefab } from "../prefab";
import { assert } from "../utils";

/**
* Wrapper class for the Prefab Map
* 
* the prefabs IDs are assigned as follow:
* 
* 0-9: [reserved]
*
* 10: slingshot
*
* 10-99: [reserved]
* 
* 100-109: balls_md
* 110-119: balls_sm
* 
* 120-129: cubes_md
* 130-139: cubes_sm
* 140-149: cubes_xs
* 150-159: cubes_hollow
* 
* 160-169: tris_md
* 170-179: tris_sm
* 180-189: tris_hollow
* 
* 190-199: fat_planks
* 200-209: [reserved]
* 
* 210-219: planks_xl
* 220-229: planks_lg
* 230-239: planks_md
* 240-249: planks_sm
* 250-259: planks_xs
* 
* 500: pig_king
* 501: ping_mustache
* 502: pig_helmet
* 503: pig_lg
* 504: pig_md
* 505: pig_sm
*
* 600: bird_red
* 601: bird_yellow
* 602: bird_blue
* 603: bird_black
* 604: bird_white
* 605: bird_green
* 607: bird_big
* 
*/

export namespace PrefabsManager {

    let prefabs: Map<number, Prefab> = new Map();

    /**
    * Returns the prefab associated with the given ID or undefined
    */
    export function getUnsure(id: number): Prefab | undefined {
        return prefabs.get(id);
    }

    /**
    * Returns the prefab associated with the specified ID.
    * Will throw an exception if the given ID is not associated with
    * any prefab
    */
    export function get(id: number): Prefab {
        const prefab = prefabs.get(id);
        assert(prefab !== undefined, `PrefabsManager#get: undefined prefab ${id}`);
        return prefab as Prefab;
    }

    /**
    * Register a prefab with the specified ID
    * @param prefab The prefab to register
    * @param id The prefab ID to register
    * @returns The registered prefab
    */
    export function register(prefab: Prefab, id: number): Prefab {
        assert(!prefabs.has(id), `PrefabsManager#register: prefab ID ${id} already used`);
        prefab.setID(id);
        prefabs.set(id, prefab);
        return prefab;
    }

    /**
    * Return whether or the a prefab is registered with the given ID
    */
    export function has(id: number): boolean {
        return prefabs.has(id);
    }

}