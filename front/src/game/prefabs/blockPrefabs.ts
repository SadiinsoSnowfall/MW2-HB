import { PrefabsManager } from "../../engine/prefabsManager";
import { Prefab } from "../../engine/prefab";
import { Img } from "../../utils";
import { SSManager } from "../../engine/utils";
import { VSBlockDisplay, BlockBehaviour } from "../components/blockComponents";


export enum Materials {
    WOOD = 100,
    STONE = 500,
    ICE = 50,
    SAND = 75
}

export enum Blocks {
    BALL_MD = 0.8,
    BALL_SM = 0.5,
    CUBE_MD = 1,
    CUBE_SM = 0.75,
}


/**
 * 
 * BALLS
 * 
 */

export const wooden_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.BALL_MD));
}), 100);

export const stone_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.BALL_MD));
}), 101);

export const ice_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.BALL_MD));
}), 102);

export const sand_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.SAND * Blocks.BALL_MD));
}), 103);

export const wooden_ball_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.BALL_MD));
}), 104);

export const stone_ball_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.BALL_MD));
}), 105);

export const ice_ball_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 6));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.BALL_MD));
}), 106);

/**
 * 
 * CUBES
 * 
 */

export const wooden_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_MD));
}), 120);

export const stone_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_MD));
}), 121);

export const ice_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_MD));
}), 122);

export const sand_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_MD, 4, 4), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.SAND * Blocks.CUBE_MD));
}), 123);


export const wooden_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_SM));
}), 130);

export const stone_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_SM));
}), 131);

export const ice_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_SM));
}), 132);

export const sand_cube_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.SAND * Blocks.CUBE_SM));
}), 133);

export const wooden_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_SM));
}), 134);

export const stone_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_SM));
}), 135);

export const ice_cube_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_SM, 4, 7), 6));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_SM));
}), 136);
