import { PrefabsManager, Img } from "../../engine/res";
import { Prefab } from "../../engine/prefab";
import { BirdDisplay } from "../components/birdComponents";
import { SSManager, Vec2 } from "../../engine/utils";
import { Collider } from "../../engine/components";
import { Circle, ConvexPolygon } from "../../engine/physics";
import { RigidBody } from "../../engine/components/rigidBody";
import { GameObject } from "src/engine/gameObject";

export namespace BirdPrefabs {

    export function isBird(obj: GameObject) {
        return ((obj.prefabID >= 600) && (obj.prefabID <= 606));
    }

    export function init() {
        /**
         * Just not to forget importing this file so that the prefabs get registered
         */
    }

    export enum BirdWeight {
        RED = 50,
        YELLOW = 50,
        BLUE = 30,
        BLACK = 80,
        WHITE = 70,
        GREEN = 50,
        BIG = 110
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

    export const BIG_SHAPE = new Circle(new Vec2(5, 7), 43);

    /**
     * PREFABS
     */

    export const BIRD_RED = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_RED, 5, 1)));
        obj.setCollider(new RigidBody(obj, RED_SHAPE, BirdWeight.RED));
    }), 600);

    export const BIRD_YELLOW = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_YELLOW, 5, 1)));
        obj.setCollider(new Collider(obj, YELLOW_SHAPE));
    }), 601);

    export const BIRD_BLUE = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_BLUE, 4, 1)));
        obj.setCollider(new Collider(obj, BLUE_SHAPE));
    }), 602);

    export const BIRD_BLACK = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_BLACK, 7, 1)));
        obj.setCollider(new Collider(obj, BLACK_SHAPE));
    }), 603);

    export const BIRD_WHITE = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_WHITE, 5, 1)));
        obj.setCollider(new Collider(obj, WHITE_SHAPE));
    }), 604);

    export const BIRD_GREEN = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_GREEN, 5, 1)));
        obj.setCollider(new Collider(obj, GREEN_SHAPE));
    }), 605);

    export const BIRD_BIG = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BirdDisplay(obj, SSManager.get(Img.BIRD_BIG, 3, 1)));
        obj.setCollider(new Collider(obj, BIG_SHAPE));
    }), 606);

}