import { PrefabsManager, Img } from "../../engine/res";
import { Prefab } from "../../engine/prefab";
import { PigDisplay, PigBehaviour } from "../components/pigComponents";
import { SSManager, Vec2 } from "../../engine/utils";
import { RigidBody } from "../../engine/components/rigidBody";
import { Circle } from "../../engine/physics";


export namespace PigPrefabs {

    export function init() {
        /**
         * Just not to forget importing to import file so that the prefabs get registered
         */
    }

    /**
     * STATS
     */
    export enum PigHealth {
        KING = 100,
        MUSTACHE = 80,
        HELMET = 80,
        LG = 60,
        MD = 40,
        SM = 30,
    }

    export enum PigWeight {
        KING = 100,
        MUSTACHE = 80,
        HELMET = 80,
        LG = 60,
        MD = 40,
        SM = 30,
    }

    /**
     * SHAPES
     */

    export const king_shape = new Circle(new Vec2(0, 13), 55);
    export const mustache_shape = new Circle(new Vec2(0, 5), 46);
    export const helmet_shape = new Circle(new Vec2(0, 0), 44);
    export const lg_shape = new Circle(new Vec2(0, 6), 43);
    export const md_shape = new Circle(new Vec2(0, 4), 34);
    export const sm_shape = new Circle(new Vec2(-1, 1), 21);

    /**
     * PREFABS
     */

    export const pig_king = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_KING, 23, 1)));
        obj.setCollider(new RigidBody(obj, king_shape, PigWeight.KING));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.KING));
    }), 500);

    export const pig_mustache = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_MUSTACHE, 23, 1)));
        obj.setCollider(new RigidBody(obj, mustache_shape, PigWeight.MUSTACHE));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.MUSTACHE));
    }), 501);

    export const pig_helmet = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_HELMET, 23, 1)));
        obj.setCollider(new RigidBody(obj, helmet_shape, PigWeight.HELMET));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.HELMET));
    }), 502);

    export const pig_lg = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_LG, 23, 1)));
        obj.setCollider(new RigidBody(obj, lg_shape, PigWeight.LG));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.LG));
    }), 503);

    export const pig_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_MD, 23, 1)));
        obj.setCollider(new RigidBody(obj, md_shape, PigWeight.MD));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.MD));
    }), 504);

    export const pig_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_SM, 23, 1)));
        obj.setCollider(new RigidBody(obj, sm_shape, PigWeight.SM));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.SM));
    }), 505);

}