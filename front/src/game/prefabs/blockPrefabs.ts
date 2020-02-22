import { PrefabsManager } from "../../engine/prefabsManager";
import { Prefab } from "../../engine/prefab";
import { Img } from "../../utils";
import { SSManager } from "../../engine/utils";
import { VSBlockDisplay } from "../components/blockComponents";


/**
 * 
 * BALLS
 * 
 */

const wooden_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 0));
}), 100);

const stone_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 1));
}), 101);

const ice_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 2));
}), 102);

const sand_ball = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 3));
}), 103);

const wooden_ball_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 4));
}), 104);

const stone_ball_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 5));
}), 105);

const ice_ball_2 = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 7), 6));
}), 106);

/**
 * 
 * CUBES
 * 
 */

const wooden_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 4), 0));
}), 120);

const stone_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 4), 1));
}), 121);

const ice_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 4), 2));
}), 122);

const sand_cube_md = PrefabsManager.register(new Prefab(obj => {
    obj.setDisplayComponent(new VSBlockDisplay(obj, SSManager.get(Img.BALLS, 4, 4), 3));
}), 123);
