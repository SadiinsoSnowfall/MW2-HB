import { PrefabsManager } from "../../engine/prefabsManager";
import { Prefab } from "../../engine/prefab";

/**
 * Pig health
 */
export enum Pigs {
    PIG_KING = 100,
    PIG_MUSTACHE = 80,
    PIG_HELMET = 80,
    PIG_LG = 60,
    PIG_MD = 40,
    PIG_SM = 30,
}

export const pig_king = PrefabsManager.register(new Prefab(obj => {

}), 500);

export const pig_mustache = PrefabsManager.register(new Prefab(obj => {

}), 501);

export const pig_helmet = PrefabsManager.register(new Prefab(obj => {

}), 502);

export const pig_lg = PrefabsManager.register(new Prefab(obj => {

}), 503);

export const pig_md = PrefabsManager.register(new Prefab(obj => {

}), 504);

export const pig_sm = PrefabsManager.register(new Prefab(obj => {

}), 505);