import { Prefab } from "./prefab";
import { assert } from "../utils";

/**
 * Wrapper class for the Prefab Map
 * 
 * the prefabs IDs are assigned as follow:
 * 
 * 0-99: [reserved]
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
 */
export class PrefabsManager {
    private static prefabs: Map<number, Prefab> = new Map();

    /**
     * Returns the prefab associated with the given ID or undefined
     */
    public static getUnsure(id: number): Prefab | undefined {
        return PrefabsManager.prefabs.get(id);
    }

    /**
     * Returns the prefab associated with the specified ID.
     * Will throw an exception if the given ID is not associated with
     * any prefab
     */
    public static get(id: number): Prefab {
        const prefab = this.prefabs.get(id);
        assert(prefab !== undefined, `PrefabsManager#get: undefined prefab ${id}`);
        return prefab as Prefab;
    }

    /**
     * Register a prefab with the specified ID
     * @param prefab The prefab to register
     * @param id The prefab ID to register
     * @returns The registered prefab
     */
    public static register(prefab: Prefab, id: number): Prefab {
        assert(!PrefabsManager.prefabs.has(id), `PrefabsManager#register: prefab ID ${id} already used`);
        PrefabsManager.prefabs.set(id, prefab);
        return prefab;
    }

    /**
     * Return whether or the a prefab is registered with the given ID
     */
    public static has(id: number): boolean {
        return PrefabsManager.prefabs.has(id);
    }

}