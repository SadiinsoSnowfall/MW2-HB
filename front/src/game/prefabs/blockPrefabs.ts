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
    CUBE_XS = 0.5,
    CUBE_HOLLOW = 1,

    TRIS_MD = 0.8,
    TRIS_SM = 0.65,
    TRIS_HOLLOW = 0.8,
}


/**
 * 
 * BALLS
 * 
 */

export const wooden_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.BALL_MD));
}), 100);

export const stone_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.BALL_MD));
}), 101);

export const ice_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.BALL_MD));
}), 102);

export const sand_ball_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.SAND * Blocks.BALL_MD));
}), 103);

export const wooden_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.BALL_MD));
}), 104);

export const stone_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.BALL_MD));
}), 105);

export const ice_ball_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_MD, 4, 7), 6));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.BALL_MD));
}), 106);



export const wooden_ball_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.BALL_SM));
}), 110);

export const stone_ball_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.BALL_SM));
}), 111);

export const ice_ball_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.BALL_SM));
}), 112);

export const wooden_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.BALL_SM));
}), 114);

export const stone_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.BALL_SM));
}), 115);

export const ice_ball_sm_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS_SM, 4, 6), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.BALL_SM));
}), 116);

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



export const wooden_cube_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_XS));
}), 140);

export const stone_cube_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_XS));
}), 141);

export const ice_cube_xs = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_XS));
}), 142);

export const wooden_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_XS));
}), 144);

export const stone_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_XS));
}), 145);

export const ice_cube_xs_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_XS, 4, 6), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_XS));
}), 146);



export const wooden_cube_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_HOLLOW));
}), 150);

export const stone_cube_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_HOLLOW));
}), 151);

export const ice_cube_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_HOLLOW));
}), 152);

export const wooden_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.CUBE_HOLLOW));
}), 154);

export const stone_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.CUBE_HOLLOW));
}), 155);

export const ice_cube_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.CUBES_HOLLOW, 4, 6), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.CUBE_HOLLOW));
}), 156);

/**
 * 
 * TRIS
 * 
 */

export const wooden_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.TRIS_MD));
}), 160);

export const stone_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.TRIS_MD));
}), 161);

export const ice_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.TRIS_MD));
}), 162);

export const sand_tris_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.SAND * Blocks.TRIS_MD));
}), 163);

export const wooden_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.TRIS_MD));
}), 164);

export const stone_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.TRIS_MD));
}), 165);

export const ice_tris_md_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_MD, 4, 7), 6));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.TRIS_MD));
}), 166);



export const wooden_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.TRIS_SM));
}), 170);

export const stone_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.TRIS_SM));
}), 171);

export const ice_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.TRIS_SM));
}), 172);

export const sand_tris_sm = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_SM, 4, 4), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.SAND * Blocks.TRIS_SM));
}), 173);



export const wooden_tris_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 0));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.TRIS_HOLLOW));
}), 180);

export const stone_tris_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 1));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.TRIS_HOLLOW));
}), 181);

export const ice_tris_hl = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 2));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.TRIS_HOLLOW));
}), 182);

export const wooden_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 3));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.WOOD * Blocks.TRIS_HOLLOW));
}), 184);

export const stone_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 4));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.STONE * Blocks.TRIS_HOLLOW));
}), 185);

export const ice_tris_hl_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.TRIS_HOLLOW, 4, 6), 5));
    obj.setBehaviourComponent(new BlockBehaviour(obj, Materials.ICE * Blocks.TRIS_HOLLOW));
}), 186);