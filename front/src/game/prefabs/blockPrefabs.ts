import { Prefab } from "../../engine/prefab";
import { VSBlockDisplay, BlockBehaviour, HSBlockDisplay } from "../components/blockComponents";
import { RigidBody } from "../../engine/components/rigidBody";
import { GameObject } from "../../engine/gameObject";
import { ParticleDisplay } from "../components/baseComponents";
import { Circle } from "../../engine/physics/circle";
import { Shape } from "../../engine/physics/shape";
import { ConvexPolygon } from "../../engine/physics/convexPolygon";
import { Sound, Img } from "../../engine/res/assetsManager";
import { PrefabsManager } from "../../engine/res/prefabsManager";
import { Vec2 } from "../../engine/utils/vec2";
import { SSManager } from "../../engine/utils/spritesheet";

/**
 * 
 * MATERIALS PROPERTIES
 * 
 */

export namespace BlockPrefabs {

    // tag
    export function init() {
        /**
         * Just not to forget importing this file so that the prefabs get registered
         */
    }

    export enum MaterialHealth {
        WOOD = 100,
        STONE = 500,
        ICE = 50,
        SAND = 50
    }

    export enum BlockMod {
        BALL_MD = 0.8,
        BALL_SM = 0.5,

        CUBE_MD = 1,
        CUBE_SM = 0.75,
        CUBE_XS = 0.5,
        CUBE_HOLLOW = 1,

        TRIS_MD = 0.8,
        TRIS_SM = 0.65,
        TRIS_HOLLOW = 0.8,

        FAT_PLANK = 0.6,
        PLANK_XL = 2,
        PLANK_LG = 1,
        PLANK_MD = 0.8,
        PLANK_SM = 0.6,
        PLANK_XS = 0.3,
    }

    export enum BlockWeight {
        WOOD = 15,
        STONE = 20,
        ICE = 10,
        SAND = 10
    }

    /**
     * 
     * VERTICES
     * 
     */

    export const ball_md_shape = new Circle(Vec2.Zero, 38);
    export const ball_sm_shape = new Circle(Vec2.Zero, 20);

    export const cube_md_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-40, -40),
        new Vec2(-40, 40),
        new Vec2(40, 40),
        new Vec2(40, -40)
    ]);

    export const cube_sm_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-20, -20),
        new Vec2(-20, 20),
        new Vec2(20, 20),
        new Vec2(20, -20)
    ]);

    export const cube_xs_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-10, -10),
        new Vec2(-10, 10),
        new Vec2(10, 10),
        new Vec2(10, -10)
    ]);

    export const cube_hl_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-41, -41),
        new Vec2(-41, 41),
        new Vec2(41, 41),
        new Vec2(41, -41)
    ]);

    export const tris_md_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-40, -44),
        new Vec2(-40, 40),
        new Vec2(44, 40)
    ]);

    export const tris_sm_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-20, -22),
        new Vec2(-20, 20),
        new Vec2(22, 20)
    ]);

    export const tris_hl_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(0, -45),
        new Vec2(-45, 41),
        new Vec2(45, 41),
    ]);

    export const planks_fat_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-40, -19),
        new Vec2(-40, 19),
        new Vec2(40, 19),
        new Vec2(40, -19)
    ]);

    export const planks_xl_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-124, -9),
        new Vec2(-124, 9),
        new Vec2(124, 9),
        new Vec2(124, -9)
    ]);

    export const planks_lg_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-101, -9),
        new Vec2(-101, 9),
        new Vec2(101, 9),
        new Vec2(101, -9)
    ]);

    export const planks_md_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-84, -9),
        new Vec2(-84, 9),
        new Vec2(84, 9),
        new Vec2(84, -9)
    ]);

    export const planks_sm_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-41, -9),
        new Vec2(-41, 9),
        new Vec2(41, 9),
        new Vec2(41, -9)
    ]);

    export const planks_xs_shape: Shape = new ConvexPolygon(Vec2.Zero, [
        new Vec2(-19, -9),
        new Vec2(-19, 9),
        new Vec2(19, 9),
        new Vec2(19, -9)
    ]);

    /**
     * 
     * SOUNDS
     * 
     */

    export const wood_hit_sounds: string[] = [
        Sound.WOOD_HIT_1,
        Sound.WOOD_HIT_2,
        Sound.WOOD_HIT_3,
        Sound.WOOD_HIT_4,
        Sound.WOOD_HIT_5,
        Sound.WOOD_HIT_6
    ];

    export const wood_damage_sounds: string[] = [
        Sound.WOOD_BREAK_1,
        Sound.WOOD_BREAK_2,
        Sound.WOOD_BREAK_3,
    ];

    export const wood_destroy_sounds: string[] = [
        Sound.WOOD_DESTROYED_1,
        Sound.WOOD_DESTROYED_2,
        Sound.WOOD_DESTROYED_3
    ];


    export const stone_hit_sounds: string[] = [
        Sound.STONE_HIT_1,
        Sound.STONE_HIT_2,
        Sound.STONE_HIT_3,
        Sound.STONE_HIT_4,
        Sound.STONE_HIT_5
    ];

    export const stone_damage_sounds: string[] = [
        Sound.STONE_BREAK_1,
        Sound.STONE_BREAK_2,
        Sound.STONE_BREAK_3
    ];

    export const stone_destroy_sounds: string[] = [
        Sound.STONE_DESTROYED_1,
        Sound.STONE_DESTROYED_2,
        Sound.STONE_DESTROYED_3
    ];


    export const ice_hit_sounds: string[] = [
        Sound.ICE_HIT_1,
        Sound.ICE_HIT_2,
        Sound.ICE_HIT_3
    ];

    export const ice_damage_sounds: string[] = [
        Sound.ICE_BREAK_1,
        Sound.ICE_BREAK_2,
        Sound.ICE_BREAK_3
    ];

    export const ice_destroy_sounds: string[] = [
        Sound.ICE_DESTROYED_1,
        Sound.ICE_DESTROYED_2,
        Sound.ICE_DESTROYED_3
    ];


    // rip le sable
    export const sand_sound: string[] = [
        Sound.SAND_BREAK
    ];

    /**
     * 
     * Particles
     * 
     */

    export function wood_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5), 3, 1, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function stone_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5), 2, 1, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function ice_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5), 0, 4, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function sand_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5), 4, 0, amount, amplitude, lifeSpanMult));
        return obj;
    }

    export function egg_particle(x: number, y: number, amount: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
        const obj = new GameObject(x, y);
        obj.setDisplay(new ParticleDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5), 1, 2, amount, amplitude, lifeSpanMult));
        return obj;
    }

    /**
     * 
     * BALLS
     * 
     */

    export const wooden_ball_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.WOOD * BlockMod.BALL_MD));
    }), 100);

    export const stone_ball_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.STONE * BlockMod.BALL_MD));
    }), 101);

    export const ice_ball_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.ICE * BlockMod.BALL_MD));
    }), 102);

    export const sand_ball_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.BALL_MD, sand_particle, sand_sound, sand_sound, sand_sound));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.SAND * BlockMod.BALL_MD));
    }), 103);

    export const wooden_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.WOOD * BlockMod.BALL_MD));
    }), 104);

    export const stone_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.STONE * BlockMod.BALL_MD));
    }), 105);

    export const ice_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 7, 4), 6));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_md_shape, BlockWeight.ICE * BlockMod.BALL_MD));
    }), 106);



    export const wooden_ball_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 6, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_sm_shape, BlockWeight.WOOD * BlockMod.BALL_SM));
    }), 110);

    export const stone_ball_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 6, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_sm_shape, BlockWeight.STONE * BlockMod.BALL_SM));
    }), 111);

    export const ice_ball_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 6, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_sm_shape, BlockWeight.ICE * BlockMod.BALL_SM));
    }), 112);

    export const wooden_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 6, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_sm_shape, BlockWeight.WOOD * BlockMod.BALL_SM));
    }), 114);

    export const stone_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 6, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_sm_shape, BlockWeight.STONE * BlockMod.BALL_SM));
    }), 115);

    export const ice_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 6, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, ball_sm_shape, BlockWeight.ICE * BlockMod.BALL_SM));
    }), 116);

    /**
     * 
     * CUBES
     * 
     */

    export const wooden_cube_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_md_shape, BlockWeight.WOOD * BlockMod.CUBE_MD));
    }), 120);

    export const stone_cube_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_md_shape, BlockWeight.STONE * BlockMod.CUBE_MD));
    }), 121);

    export const ice_cube_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_md_shape, BlockWeight.ICE * BlockMod.CUBE_MD));
    }), 122);

    export const sand_cube_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.CUBE_MD, sand_particle, sand_sound, sand_sound, sand_sound));
        obj.setCollider(new RigidBody(obj, cube_md_shape, BlockWeight.SAND * BlockMod.CUBE_MD));
    }), 123);



    export const wooden_cube_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.WOOD * BlockMod.CUBE_SM));
    }), 130);

    export const stone_cube_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.STONE * BlockMod.CUBE_SM));
    }), 131);

    export const ice_cube_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.ICE * BlockMod.CUBE_SM));
    }), 132);

    export const sand_cube_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.CUBE_SM, sand_particle, sand_sound, sand_sound, sand_sound));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.SAND * BlockMod.CUBE_SM));
    }), 133);

    export const wooden_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.WOOD * BlockMod.CUBE_SM));
    }), 134);

    export const stone_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.STONE * BlockMod.CUBE_SM));
    }), 135);

    export const ice_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 7, 4), 6));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_sm_shape, BlockWeight.ICE * BlockMod.CUBE_SM));
    }), 136);



    export const wooden_cube_xs = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 6, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_xs_shape, BlockWeight.WOOD * BlockMod.CUBE_XS));
    }), 140);

    export const stone_cube_xs = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 6, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_xs_shape, BlockWeight.STONE * BlockMod.CUBE_XS));
    }), 141);

    export const ice_cube_xs = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 6, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_xs_shape, BlockWeight.ICE * BlockMod.CUBE_XS));
    }), 142);

    export const wooden_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 6, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_xs_shape, BlockWeight.WOOD * BlockMod.CUBE_XS));
    }), 144);

    export const stone_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 6, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_xs_shape, BlockWeight.STONE * BlockMod.CUBE_XS));
    }), 145);

    export const ice_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 6, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_xs_shape, BlockWeight.ICE * BlockMod.CUBE_XS));
    }), 146);



    export const wooden_cube_hl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 6, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_hl_shape, BlockWeight.WOOD * BlockMod.CUBE_HOLLOW));
    }), 150);

    export const stone_cube_hl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 6, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_hl_shape, BlockWeight.STONE * BlockMod.CUBE_HOLLOW));
    }), 151);

    export const ice_cube_hl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 6, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_hl_shape, BlockWeight.ICE * BlockMod.CUBE_HOLLOW));
    }), 152);

    export const wooden_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 6, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_hl_shape, BlockWeight.WOOD * BlockMod.CUBE_HOLLOW));
    }), 154);

    export const stone_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 6, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_hl_shape, BlockWeight.STONE * BlockMod.CUBE_HOLLOW));
    }), 155);

    export const ice_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 6, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, cube_hl_shape, BlockWeight.ICE * BlockMod.CUBE_HOLLOW));
    }), 156);

    /**
     * 
     * TRIS
     * 
     */

    export const wooden_tris_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.WOOD * BlockMod.TRIS_MD));
    }), 160);

    export const stone_tris_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.STONE * BlockMod.TRIS_MD));
    }), 161);

    export const ice_tris_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.ICE * BlockMod.TRIS_MD));
    }), 162);

    export const sand_tris_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.TRIS_MD, sand_particle, sand_sound, sand_sound, sand_sound));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.SAND * BlockMod.TRIS_MD));
    }), 163);

    export const wooden_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.WOOD * BlockMod.TRIS_MD));
    }), 164);

    export const stone_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.STONE * BlockMod.TRIS_MD));
    }), 165);

    export const ice_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 7, 4), 6));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_md_shape, BlockWeight.ICE * BlockMod.TRIS_MD));
    }), 166);



    export const wooden_tris_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_sm_shape, BlockWeight.WOOD * BlockMod.TRIS_SM));
    }), 170);

    export const stone_tris_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_sm_shape, BlockWeight.STONE * BlockMod.TRIS_SM));
    }), 171);

    export const ice_tris_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_sm_shape, BlockWeight.ICE * BlockMod.TRIS_SM));
    }), 172);

    export const sand_tris_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.TRIS_SM, sand_particle, sand_sound, sand_sound, sand_sound));
        obj.setCollider(new RigidBody(obj, tris_sm_shape, BlockWeight.SAND * BlockMod.TRIS_SM));
    }), 173);



    export const wooden_tris_hl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 6, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_hl_shape, BlockWeight.WOOD * BlockMod.TRIS_HOLLOW));
    }), 180);

    export const stone_tris_hl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 6, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_hl_shape, BlockWeight.STONE * BlockMod.TRIS_HOLLOW));
    }), 181);

    export const ice_tris_hl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 6, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_hl_shape, BlockWeight.ICE * BlockMod.TRIS_HOLLOW));
    }), 182);

    export const wooden_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 6, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_hl_shape, BlockWeight.WOOD * BlockMod.TRIS_HOLLOW));
    }), 184);

    export const stone_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 6, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_hl_shape, BlockWeight.STONE * BlockMod.TRIS_HOLLOW));
    }), 185);

    export const ice_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 6, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, tris_hl_shape, BlockWeight.ICE * BlockMod.TRIS_HOLLOW));
    }), 186);

    /**
     * 
     * PLANKS
     * 
     */

    export const wooden_plank_fat = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.FAT_PLANK, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.WOOD * BlockMod.FAT_PLANK));
    }), 190);

    export const stone_plank_fat = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 1));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.FAT_PLANK, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.STONE * BlockMod.FAT_PLANK));
    }), 191);

    export const ice_plank_fat = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 2));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.FAT_PLANK, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.ICE * BlockMod.FAT_PLANK));
    }), 192);

    export const sand_plank_fat = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 3));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.FAT_PLANK, sand_particle, sand_sound, sand_sound, sand_sound));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.SAND * BlockMod.FAT_PLANK));
    }), 193);

    export const wooden_plank_fat_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.FAT_PLANK, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.WOOD * BlockMod.FAT_PLANK));
    }), 194);

    export const stone_plank_fat_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 5));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.FAT_PLANK, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.STONE * BlockMod.FAT_PLANK));
    }), 195);

    export const ice_plank_fat_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 7, 4), 6));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.FAT_PLANK, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_fat_shape, BlockWeight.ICE * BlockMod.FAT_PLANK));
    }), 196);



    export const wooden_plank_xl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XL, 1, 3 * 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_XL, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xl_shape, BlockWeight.WOOD * BlockMod.PLANK_XL));
    }), 210);

    export const stone_plank_xl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XL, 1, 3 * 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_XL, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xl_shape, BlockWeight.STONE * BlockMod.PLANK_XL));
    }), 211);

    export const ice_plank_xl = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XL, 1, 3 * 4), 8));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_XL, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xl_shape, BlockWeight.ICE * BlockMod.PLANK_XL));
    }), 212);



    export const wooden_plank_lg = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 1, 6 * 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_LG, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_lg_shape, BlockWeight.WOOD * BlockMod.PLANK_LG));
    }), 220);

    export const stone_plank_lg = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 1, 6 * 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_LG, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_lg_shape, BlockWeight.STONE * BlockMod.PLANK_LG));
    }), 221);

    export const ice_plank_lg = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 1, 6 * 4), 8));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_LG, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_lg_shape, BlockWeight.ICE * BlockMod.PLANK_LG));
    }), 222);

    export const wooden_plank_lg_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 1, 6 * 4), 12));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_LG, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_lg_shape, BlockWeight.WOOD * BlockMod.PLANK_LG));
    }), 223);

    export const stone_plank_lg_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 1, 6 * 4), 16));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_LG, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_lg_shape, BlockWeight.STONE * BlockMod.PLANK_LG));
    }), 224);

    export const ice_plank_lg_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 1, 6 * 4), 20));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_LG, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_lg_shape, BlockWeight.ICE * BlockMod.PLANK_LG));
    }), 225);



    export const wooden_plank_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 1, 6 * 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_md_shape, BlockWeight.WOOD * BlockMod.PLANK_MD));
    }), 230);

    export const stone_plank_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 1, 6 * 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_md_shape, BlockWeight.STONE * BlockMod.PLANK_MD));
    }), 231);

    export const ice_plank_md = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 1, 6 * 4), 8));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_md_shape, BlockWeight.ICE * BlockMod.PLANK_MD));
    }), 232);

    export const wooden_plank_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 1, 6 * 4), 12));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_md_shape, BlockWeight.WOOD * BlockMod.PLANK_MD));
    }), 233);

    export const stone_plank_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 1, 6 * 4), 16));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_md_shape, BlockWeight.STONE * BlockMod.PLANK_MD));
    }), 234);

    export const ice_plank_md_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 1, 6 * 4), 20));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_md_shape, BlockWeight.ICE * BlockMod.PLANK_MD));
    }), 235);



    export const wooden_plank_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 1, 6 * 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_sm_shape, BlockWeight.WOOD * BlockMod.PLANK_SM));
    }), 240);

    export const stone_plank_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 1, 6 * 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_sm_shape, BlockWeight.STONE * BlockMod.PLANK_SM));
    }), 241);

    export const ice_plank_sm = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 1, 6 * 4), 8));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_sm_shape, BlockWeight.ICE * BlockMod.PLANK_SM));
    }), 242);

    export const wooden_plank_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 1, 6 * 4), 12));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_sm_shape, BlockWeight.WOOD * BlockMod.PLANK_SM));
    }), 243);

    export const stone_plank_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 1, 6 * 4), 16));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_sm_shape, BlockWeight.STONE * BlockMod.PLANK_SM));
    }), 244);

    export const ice_plank_sm_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 1, 6 * 4), 20));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_sm_shape, BlockWeight.ICE * BlockMod.PLANK_SM));
    }), 245);



    export const wooden_plank_xs = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 1, 6 * 4), 0));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xs_shape, BlockWeight.WOOD * BlockMod.PLANK_XS));
    }), 250);

    export const stone_plank_xs = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 1, 6 * 4), 4));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xs_shape, BlockWeight.STONE * BlockMod.PLANK_XS));
    }), 251);

    export const ice_plank_xs = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 1, 6 * 4), 8));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xs_shape, BlockWeight.ICE * BlockMod.PLANK_XS));
    }), 252);

    export const wooden_plank_xs_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 1, 6 * 4), 12));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xs_shape, BlockWeight.WOOD * BlockMod.PLANK_XS));
    }), 253);

    export const stone_plank_xs_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 1, 6 * 4), 16));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xs_shape, BlockWeight.STONE * BlockMod.PLANK_XS));
    }), 254);

    export const ice_plank_xs_2 = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 1, 6 * 4), 20));
        obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
        obj.setCollider(new RigidBody(obj, planks_xs_shape, BlockWeight.ICE * BlockMod.PLANK_XS));
    }), 255);

}