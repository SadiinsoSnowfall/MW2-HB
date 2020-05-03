import { PrefabsManager, Img, Sound } from "../../engine/res";
import { Prefab } from "../../engine/prefab";
import { BirdDisplay, BaseBirdBehaviour, RedBirdDisplay, BigBirdDisplay, BlueBirdDisplay, GreenBirdDisplay } from "../components/birdComponents";
import { SSManager, Vec2 } from "../../engine/utils";
import { Circle, ConvexPolygon } from "../../engine/physics";
import { RigidBody } from "../../engine/components/rigidBody";
import { GameObject } from "../../engine/gameObject";
import { ParticleDisplay } from "../components/baseComponents";

export namespace BirdPrefabs {

    /**
     * Return true if the given object is a bird
     */
    export function isBird(obj: GameObject) {
        return ((obj.prefabID >= 600) && (obj.prefabID <= 606));
    }

    export function init() {
        /**
         * Just not to forget importing this file so that the prefabs get registered
         */
    }

    export enum BirdWeight {
        RED = 40,
        YELLOW = 40,
        BLUE = 30,
        BLACK = 60,
        WHITE = 50,
        GREEN = 40,
        BIG = 75
    }

    /**
     * SHAPES
     */

    export const RED_SHAPE = new Circle(new Vec2(3, 3), 20);

    export const YELLOW_SHAPE = new ConvexPolygon(Vec2.Zero, [
        new Vec2(0, -25),
        new Vec2(-30, 25),
        new Vec2(30, 25)
    ]);

    export const BLUE_SHAPE = new Circle(new Vec2(0, 1), 13);

    export const BLACK_SHAPE = new Circle(new Vec2(0, 9), 31);

    export const WHITE_SHAPE = new Circle(new Vec2(5, 11), 37);

    export const GREEN_SHAPE = new Circle(new Vec2(-15, 7), 26);

    export const BIG_SHAPE = new Circle(new Vec2(5, 5), 42);

    /**
     * SOUNDS
     */

    export const RED_SOUNDS: string[] = [
        Sound.BIRD_RED_SELECT,
        Sound.BIRD_RED_FLY,
        Sound.BIRD_RED_HIT_1,
        Sound.BIRD_RED_HIT_2,
        Sound.BIRD_RED_HIT_3,
        Sound.BIRD_RED_HIT_4
    ];

    export const YELLOW_SOUNDS: string[] = [
        Sound.BIRD_YELLOW_SELECT,
        Sound.BIRD_YELLOW_FLY,
        Sound.BIRD_YELLOW_HIT_1,
        Sound.BIRD_YELLOW_HIT_2,
        Sound.BIRD_YELLOW_HIT_3,
        Sound.BIRD_YELLOW_HIT_4,
        Sound.BIRD_YELLOW_HIT_5
    ];

    export const BLUE_SOUNDS: string[] = [
        Sound.BIRD_BLUE_SELECT,
        Sound.BIRD_BLUE_FLY,
        Sound.BIRD_BLUE_HIT_1,
        Sound.BIRD_BLUE_HIT_2,
        Sound.BIRD_BLUE_HIT_3,
        Sound.BIRD_BLUE_HIT_4,
        Sound.BIRD_BLUE_HIT_5
    ];

    export const BLACK_SOUNDS: string[] = [
        Sound.BIRD_BLACK_SELECT,
        Sound.BIRD_BLACK_FLY,
        Sound.BIRD_BLACK_HIT_1,
        Sound.BIRD_BLACK_HIT_2,
        Sound.BIRD_BLACK_HIT_3,
        Sound.BIRD_BLACK_HIT_4
    ];

    export const WHITE_SOUNDS: string[] = [
        Sound.BIRD_WHITE_SELECT,
        Sound.BIRD_WHITE_FLY,
        Sound.BIRD_WHITE_HIT_1,
        Sound.BIRD_WHITE_HIT_2,
        Sound.BIRD_WHITE_HIT_3,
        Sound.BIRD_WHITE_HIT_4,
        Sound.BIRD_WHITE_HIT_5
    ];

    // uses the same hit sounds as the red one
    export const GREEN_SOUNDS: string[] = [
        Sound.BIRD_GREEN_SELECT,
        Sound.BIRD_GREEN_FLY,
        Sound.BIRD_BIG_HIT_1,
        Sound.BIRD_BIG_HIT_2,
        Sound.BIRD_BIG_HIT_3,
        Sound.BIRD_BIG_HIT_4
    ];

    // uses the same select & fly sounds as the red one
    export const BIG_SOUNDS: string[] = [
        Sound.BIRD_RED_SELECT,
        Sound.BIRD_RED_FLY,
        Sound.BIRD_BIG_HIT_1,
        Sound.BIRD_BIG_HIT_2,
        Sound.BIRD_BIG_HIT_3,
        Sound.BIRD_BIG_HIT_4
    ];

    /**
     * PARTICLES
     */

    export function red_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.FEATHERS, 5, 7), 0, 4, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function yellow_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.FEATHERS, 5, 7), 1, 3, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function blue_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.FEATHERS, 5, 7), 2, 2, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function black_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.FEATHERS, 5, 7), 3, 2, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function white_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.FEATHERS, 5, 7), 4, 2, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function green_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.FEATHERS, 5, 7), 5, 2, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function bird_smoke(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.SMOKE, 6, 3), 2, 2, amount, amplitude, lifeSpanMult));
        return obj;
    }

    /**
     * PREFABS
     */

    export const BIRD_RED = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new RedBirdDisplay(obj, SSManager.get(Img.BIRD_RED, 5, 1)));
        obj.setCollider(new RigidBody(obj, RED_SHAPE, BirdWeight.RED));
        obj.setBehaviour(new BaseBirdBehaviour(obj, RED_SOUNDS, red_particle, bird_smoke));
    }), 600);

    export const BIRD_YELLOW = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new RedBirdDisplay(obj, SSManager.get(Img.BIRD_YELLOW, 5, 1)));
        obj.setCollider(new RigidBody(obj, YELLOW_SHAPE, BirdWeight.YELLOW));
        obj.setBehaviour(new BaseBirdBehaviour(obj, YELLOW_SOUNDS, yellow_particle, bird_smoke));
    }), 601);

    export const BIRD_BLUE = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BlueBirdDisplay(obj, SSManager.get(Img.BIRD_BLUE, 4, 1)));
        obj.setCollider(new RigidBody(obj, BLUE_SHAPE, BirdWeight.BLUE));
        obj.setBehaviour(new BaseBirdBehaviour(obj, BLUE_SOUNDS, blue_particle, bird_smoke));
    }), 602);

    export const BIRD_BLACK = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BlueBirdDisplay(obj, SSManager.get(Img.BIRD_BLACK, 7, 1)));
        obj.setCollider(new RigidBody(obj, BLACK_SHAPE, BirdWeight.BLACK));
        obj.setBehaviour(new BaseBirdBehaviour(obj, BLACK_SOUNDS, black_particle, bird_smoke));
    }), 603);

    export const BIRD_WHITE = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BlueBirdDisplay(obj, SSManager.get(Img.BIRD_WHITE, 5, 1)));
        obj.setCollider(new RigidBody(obj, WHITE_SHAPE, BirdWeight.WHITE));
        obj.setBehaviour(new BaseBirdBehaviour(obj, WHITE_SOUNDS, white_particle, bird_smoke));
    }), 604);

    export const BIRD_GREEN = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new GreenBirdDisplay(obj, SSManager.get(Img.BIRD_GREEN, 5, 1)));
        obj.setCollider(new RigidBody(obj, GREEN_SHAPE, BirdWeight.GREEN));
        obj.setBehaviour(new BaseBirdBehaviour(obj, GREEN_SOUNDS, green_particle, bird_smoke));
    }), 605);

    export const BIRD_BIG = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BigBirdDisplay(obj, SSManager.get(Img.BIRD_BIG, 3, 1)));
        obj.setCollider(new RigidBody(obj, BIG_SHAPE, BirdWeight.BIG));
        obj.setBehaviour(new BaseBirdBehaviour(obj, BIG_SOUNDS, red_particle, bird_smoke));
    }), 606);

}