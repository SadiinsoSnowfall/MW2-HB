import { PrefabsManager } from "../../engine/prefabsManager";
import { Prefab } from "../../engine/prefab";
import { Img, Sound, randomIn } from "../../utils";
import { SSManager, Vec2 } from "../../engine/utils";
import { VSBlockDisplay, BlockBehaviour, BlockRigidBody, HSBlockDisplay, ParticleBehaviour } from "../components/blockComponents";
import { ConvexPolygon, Circle } from "../../engine/shapes";
import { Collider } from "../../engine/components";
import { SSDisplay } from "../components/baseComponents";
import { GameObject } from "../../engine/gameObject";

/**
 * 
 * MATERIALS PROPERTIES
 * 
 */

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
    WOOD = 10,
    STONE = 20,
    ICE = 10,
    SAND = 10
}

/**
 * 
 * VERTICES
 * 
 */

export const ball_md_radius = 38;
export const ball_sm_radius = 20;

export const cube_md_vertices: Vec2[] = [
    new Vec2(-40, -40),
    new Vec2(-40, 40),
    new Vec2(40, 40),
    new Vec2(40, -40)
];

export const cube_sm_vertices: Vec2[] = [
    new Vec2(-20, -20),
    new Vec2(-20, 20),
    new Vec2(20, 20),
    new Vec2(20, -20)
];

export const cube_xs_vertices: Vec2[] = [
    new Vec2(-10, -10),
    new Vec2(-10, 10),
    new Vec2(10, 10),
    new Vec2(10, -10)
];

export const cube_hl_vertices: Vec2[] = [
    new Vec2(-41, -41),
    new Vec2(-41, 41),
    new Vec2(41, 41),
    new Vec2(41, -41)
];

export const tris_md_vertices: Vec2[] = [
    new Vec2(-40, -44),
    new Vec2(-40, 40),
    new Vec2(44, 40)
];

export const tris_sm_vertices: Vec2[] = [
    new Vec2(-20, -22),
    new Vec2(-20, 20),
    new Vec2(22, 20)
];

export const tris_hl_vertices: Vec2[] = [
    new Vec2(0, -45),
    new Vec2(-45, 41),
    new Vec2(45, 41),
];

export const planks_fat_vertices: Vec2[] = [
    new Vec2(-40, -19),
    new Vec2(-40, 19),
    new Vec2(40, 19),
    new Vec2(40, -19)
];

export const planks_xl_vertices: Vec2[] = [
    new Vec2(-124, -9),
    new Vec2(-124, 9),
    new Vec2(124, 9),
    new Vec2(124, -9)
];

export const planks_lg_vertices: Vec2[] = [
    new Vec2(-101, -9),
    new Vec2(-101, 9),
    new Vec2(101, 9),
    new Vec2(101, -9)
];

export const planks_md_vertices: Vec2[] = [
    new Vec2(-84, -9),
    new Vec2(-84, 9),
    new Vec2(84, 9),
    new Vec2(84, -9)
];

export const planks_sm_vertices: Vec2[] = [
    new Vec2(-41, -9),
    new Vec2(-41, 9),
    new Vec2(41, 9),
    new Vec2(41, -9)
];

export const planks_xs_vertices: Vec2[] = [
    new Vec2(-19, -9),
    new Vec2(-19, 9),
    new Vec2(19, 9),
    new Vec2(19, -9)
];

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

export type ParticleCreator = (x: number, y: number, amplitude: number, lifespan?: number) => GameObject;

export function wood_particle(x: number, y: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
    let obj = new GameObject(x, y);
    obj.setDisplay(new SSDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5).getSprite(randomIn(0, 1), 3)));
    obj.setBehaviour(new ParticleBehaviour(obj, amplitude, lifeSpanMult));
    return obj;
}

export function stone_particle(x: number, y: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
    let obj = new GameObject(x, y);
    obj.setDisplay(new SSDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5).getSprite(randomIn(0, 1), 2)));
    obj.setBehaviour(new ParticleBehaviour(obj, amplitude, lifeSpanMult));
    return obj;
}

export function ice_particle(x: number, y: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
    let obj = new GameObject(x, y);
    obj.setDisplay(new SSDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5).getSprite(randomIn(0, 4), 0)));
    obj.setBehaviour(new ParticleBehaviour(obj, amplitude, lifeSpanMult));
    return obj;
}

export function sand_particle(x: number, y: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
    let obj = new GameObject(x, y);
    obj.setDisplay(new SSDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5).getSprite(0, 4)));
    obj.setBehaviour(new ParticleBehaviour(obj, amplitude, lifeSpanMult));
    return obj;
}

export function egg_particle(x: number, y: number, amplitude: number, lifeSpanMult: number = 1): GameObject {
    let obj = new GameObject(x, y);
    obj.setDisplay(new SSDisplay(obj, SSManager.get(Img.DEBRIS, 5, 5).getSprite(randomIn(0, 2), 1)));
    obj.setBehaviour(new ParticleBehaviour(obj, amplitude, lifeSpanMult));
    return obj;
}

/**
 * 
 * BALLS
 * 
 */

export const wooden_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 100);

export const stone_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 101);

export const ice_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 102);

export const sand_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.BALL_MD, sand_particle, sand_sound, sand_sound, sand_sound));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.SAND * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 103);

export const wooden_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 104);

export const stone_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 105);

export const ice_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 6));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.BALL_MD));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_md_radius)));
}), 106);



export const wooden_ball_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_SM));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_sm_radius)));
}), 110);

export const stone_ball_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_SM));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_sm_radius)));
}), 111);

export const ice_ball_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_SM));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_sm_radius)));
}), 112);

export const wooden_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.BALL_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_SM));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_sm_radius)));
}), 114);

export const stone_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.BALL_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_SM));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_sm_radius)));
}), 115);

export const ice_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.BALL_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.BALL_SM));
    obj.setCollider(new Collider(obj, new Circle(Vec2.Zero, ball_sm_radius)));
}), 116);

/**
 * 
 * CUBES
 * 
 */

export const wooden_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_md_vertices)));
}), 120);

export const stone_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_md_vertices)));
}), 121);

export const ice_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_md_vertices)));
}), 122);

export const sand_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.CUBE_MD, sand_particle, sand_sound, sand_sound, sand_sound));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.SAND * BlockMod.CUBE_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_md_vertices)));
}), 123);



export const wooden_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 130);

export const stone_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 131);

export const ice_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 132);

export const sand_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.CUBE_SM, sand_particle, sand_sound, sand_sound, sand_sound));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.SAND * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 133);

export const wooden_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 134);

export const stone_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 135);

export const ice_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 6));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_sm_vertices)));
}), 136);



export const wooden_cube_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_xs_vertices)));
}), 140);

export const stone_cube_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_xs_vertices)));
}), 141);

export const ice_cube_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_xs_vertices)));
}), 142);

export const wooden_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_xs_vertices)));
}), 144);

export const stone_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_xs_vertices)));
}), 145);

export const ice_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_xs_vertices)));
}), 146);



export const wooden_cube_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_hl_vertices)));
}), 150);

export const stone_cube_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_hl_vertices)));
}), 151);

export const ice_cube_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_hl_vertices)));
}), 152);

export const wooden_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.CUBE_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.CUBE_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_hl_vertices)));
}), 154);

export const stone_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.CUBE_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.CUBE_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_hl_vertices)));
}), 155);

export const ice_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.CUBE_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.CUBE_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, cube_hl_vertices)));
}), 156);

/**
 * 
 * TRIS
 * 
 */

export const wooden_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 160);

export const stone_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 161);

export const ice_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 162);

export const sand_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.TRIS_MD, sand_particle, sand_sound, sand_sound, sand_sound));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.SAND * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 163);

export const wooden_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 164);

export const stone_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 165);

export const ice_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 6));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.TRIS_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_md_vertices)));
}), 166);



export const wooden_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.TRIS_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_sm_vertices)));
}), 170);

export const stone_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.TRIS_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_sm_vertices)));
}), 171);

export const ice_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.TRIS_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_sm_vertices)));
}), 172);

export const sand_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.TRIS_SM, sand_particle, sand_sound, sand_sound, sand_sound));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.SAND * BlockMod.TRIS_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_sm_vertices)));
}), 173);



export const wooden_tris_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.TRIS_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_hl_vertices)));
}), 180);

export const stone_tris_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.TRIS_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_hl_vertices)));
}), 181);

export const ice_tris_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.TRIS_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_hl_vertices)));
}), 182);

export const wooden_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.TRIS_HOLLOW, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.TRIS_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_hl_vertices)));
}), 184);

export const stone_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.TRIS_HOLLOW, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.TRIS_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_hl_vertices)));
}), 185);

export const ice_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.TRIS_HOLLOW, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.TRIS_HOLLOW));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, tris_hl_vertices)));
}), 186);

/**
 * 
 * PLANKS
 * 
 */

export const wooden_plank_fat = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.FAT_PLANK, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 190);

export const stone_plank_fat = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 1));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.FAT_PLANK, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 191);

export const ice_plank_fat = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 2));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.FAT_PLANK, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 192);

export const sand_plank_fat = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 3));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.SAND * BlockMod.FAT_PLANK, sand_particle, sand_sound, sand_sound, sand_sound));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.SAND * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 193);

export const wooden_plank_fat_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.FAT_PLANK, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 194);

export const stone_plank_fat_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 5));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.FAT_PLANK, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 195);

export const ice_plank_fat_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new VSBlockDisplay(obj, SSManager.get(Img.FAT_PLANKS, 4, 7), 6));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.FAT_PLANK, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.FAT_PLANK));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_fat_vertices)));
}), 196);



export const wooden_plank_xl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XL, 3 * 4, 1), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_XL, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_XL));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xl_vertices)));
}), 210);

export const stone_plank_xl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XL, 3 * 4, 1), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_XL, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_XL));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xl_vertices)));
}), 211);

export const ice_plank_xl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XL, 3 * 4, 1), 8));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_XL, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_XL));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xl_vertices)));
}), 212);



export const wooden_plank_lg = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 6 * 4, 1), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_LG, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_LG));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_lg_vertices)));
}), 220);

export const stone_plank_lg = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 6 * 4, 1), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_LG, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_LG));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_lg_vertices)));
}), 221);

export const ice_plank_lg = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 6 * 4, 1), 8));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_LG, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_LG));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_lg_vertices)));
}), 222);

export const wooden_plank_lg_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 6 * 4, 1), 12));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_LG, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_LG));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_lg_vertices)));
}), 223);

export const stone_plank_lg_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 6 * 4, 1), 16));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_LG, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_LG));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_lg_vertices)));
}), 224);

export const ice_plank_lg_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_LG, 6 * 4, 1), 20));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_LG, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_LG));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_lg_vertices)));
}), 225);



export const wooden_plank_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 6 * 4, 1), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_md_vertices)));
}), 230);

export const stone_plank_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 6 * 4, 1), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_md_vertices)));
}), 231);

export const ice_plank_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 6 * 4, 1), 8));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_md_vertices)));
}), 232);

export const wooden_plank_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 6 * 4, 1), 12));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_MD, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_md_vertices)));
}), 233);

export const stone_plank_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 6 * 4, 1), 16));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_MD, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_md_vertices)));
}), 234);

export const ice_plank_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_MD, 6 * 4, 1), 20));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_MD, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_MD));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_md_vertices)));
}), 235);



export const wooden_plank_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 6 * 4, 1), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_sm_vertices)));
}), 240);

export const stone_plank_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 6 * 4, 1), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_sm_vertices)));
}), 241);

export const ice_plank_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 6 * 4, 1), 8));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_sm_vertices)));
}), 242);

export const wooden_plank_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 6 * 4, 1), 12));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_SM, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_sm_vertices)));
}), 243);

export const stone_plank_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 6 * 4, 1), 16));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_SM, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_sm_vertices)));
}), 244);

export const ice_plank_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_SM, 6 * 4, 1), 20));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_SM, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_SM));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_sm_vertices)));
}), 245);



export const wooden_plank_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 6 * 4, 1), 0));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xs_vertices)));
}), 250);

export const stone_plank_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 6 * 4, 1), 4));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xs_vertices)));
}), 251);

export const ice_plank_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 6 * 4, 1), 8));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xs_vertices)));
}), 252);

export const wooden_plank_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 6 * 4, 1), 12));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.WOOD * BlockMod.PLANK_XS, wood_particle, wood_hit_sounds, wood_damage_sounds, wood_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.WOOD * BlockMod.PLANK_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xs_vertices)));
}), 253);

export const stone_plank_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 6 * 4, 1), 16));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.STONE * BlockMod.PLANK_XS, stone_particle, stone_hit_sounds, stone_damage_sounds, stone_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.STONE * BlockMod.PLANK_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xs_vertices)));
}), 254);

export const ice_plank_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplay(new HSBlockDisplay(obj, SSManager.get(Img.PLANKS_XS, 6 * 4, 1), 20));
    obj.setBehaviour(new BlockBehaviour(obj, MaterialHealth.ICE * BlockMod.PLANK_XS, ice_particle, ice_hit_sounds, ice_damage_sounds, ice_destroy_sounds));
    obj.setRigidBody(new BlockRigidBody(obj, BlockWeight.ICE * BlockMod.PLANK_XS));
    obj.setCollider(new Collider(obj, new ConvexPolygon(Vec2.Zero, planks_xs_vertices)));
}), 255);