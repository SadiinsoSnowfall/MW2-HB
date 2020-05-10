import { Prefab } from "../../engine/prefab";
import { PigDisplay, PigBehaviour } from "../components/pigComponents";
import { RigidBody } from "../../engine/components/rigidBody";
import { Circle } from "../../engine/physics/circle";
import { Sound, Img } from "../../engine/res/assetsManager";
import { PrefabsManager } from "../../engine/res/prefabsManager";
import { Vec2 } from "../../engine/utils/vec2";
import { SSManager } from "../../engine/utils/spritesheet";


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
     * SOUNDS
     */

    export const hit_sounds: string[] = [
        Sound.PIG_HIT_1,
        Sound.PIG_HIT_2,
        Sound.PIG_HIT_3,
        Sound.PIG_HIT_4,
        Sound.PIG_HIT_5,
        Sound.PIG_HIT_6,
        Sound.PIG_HIT_7,
        Sound.PIG_HIT_8
    ];

    export const damage_sounds: string[] = [
        Sound.PIG_DAMAGE_1,
        Sound.PIG_DAMAGE_2,
        Sound.PIG_DAMAGE_3,
        Sound.PIG_DAMAGE_4,
        Sound.PIG_DAMAGE_5,
        Sound.PIG_DAMAGE_6,
        Sound.PIG_DAMAGE_7,
        Sound.PIG_DAMAGE_8
    ];

    export const destroy_sounds: string[] = [
        Sound.PIG_DESTROYED
    ];

    export const talk_sounds: string[] = [
        Sound.PIG_OINK_1,
        Sound.PIG_OINK_2,
        Sound.PIG_OINK_3,
        Sound.PIG_OINK_4,
        Sound.PIG_OINK_5,
        Sound.PIG_OINK_6,
        Sound.PIG_OINK_7,
        Sound.PIG_OINK_8,
        Sound.PIG_OINK_9,
        Sound.PIG_OINK_10,
        Sound.PIG_HI_1,
        Sound.PIG_HI_2
    ]

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
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.KING, talk_sounds, hit_sounds, damage_sounds, destroy_sounds));
    }), 500);

    export const pig_mustache = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_MUSTACHE, 23, 1)));
        obj.setCollider(new RigidBody(obj, mustache_shape, PigWeight.MUSTACHE));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.MUSTACHE, talk_sounds, hit_sounds, damage_sounds, destroy_sounds));
    }), 501);

    export const pig_helmet = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_HELMET, 23, 1)));
        obj.setCollider(new RigidBody(obj, helmet_shape, PigWeight.HELMET));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.HELMET, talk_sounds, hit_sounds, damage_sounds, destroy_sounds));
    }), 502);

    export const pig_lg = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_LG, 23, 1)));
        obj.setCollider(new RigidBody(obj, lg_shape, PigWeight.LG));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.LG, talk_sounds, hit_sounds, damage_sounds, destroy_sounds));
    }), 503);

    export const pig_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_MD, 23, 1)));
        obj.setCollider(new RigidBody(obj, md_shape, PigWeight.MD));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.MD, talk_sounds, hit_sounds, damage_sounds, destroy_sounds));
    }), 504);

    export const pig_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new PigDisplay(obj, SSManager.get(Img.PIG_SM, 23, 1)));
        obj.setCollider(new RigidBody(obj, sm_shape, PigWeight.SM));
        obj.setBehaviour(new PigBehaviour(obj, PigHealth.SM, talk_sounds, hit_sounds, damage_sounds, destroy_sounds));
    }), 505);

}