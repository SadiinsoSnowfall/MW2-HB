import { Prefab } from "../../engine/prefab";
import { SpinnyDisplay, SpinnyBehaviour, WigglyDisplay, WigglyBehaviour, FPSMetterDisplay, ImageDisplay, SpriteDisplay, YoloSpritesheetDisplay, CircleBehaviour, WandererBehaviour } from "../components/debugComponents";
import { Scene } from "../../engine/scene";
import { Assets, Img } from "../../engine/res/assetsManager";
import { Alignment, Style } from "../../engine/utils/textFormat";
import { Spritesheet } from "../../engine/utils/spritesheet";

export const wigglyThingy = new Prefab(obj => {
    obj.setDisplay(new WigglyDisplay(obj, "#008000", 100, 55));
    obj.setBehaviour(new WigglyBehaviour(obj, 0.0075));
});

export const spinnyThingy = new Prefab(obj => {
    obj.setDisplay(new SpinnyDisplay(obj, "#008000", 50));
    obj.setBehaviour(new SpinnyBehaviour(obj, 0.01));
});

export const FPSMetter = new Prefab(obj => {
    obj.setDisplay(new FPSMetterDisplay(obj, Alignment.LEFT, Style.FILL));
});

export const funnyFPSMetter = new Prefab(obj => {
    obj.setDisplay(new FPSMetterDisplay(obj, Alignment.CENTERED, Style.FILL));
    obj.setBehaviour(new WigglyBehaviour(obj, 0.01));
});

export const hilariousFPSMetter = new Prefab(obj => {
    obj.setDisplay(new FPSMetterDisplay(obj, Alignment.RIGHT, Style.STROKE));
    obj.setBehaviour(new SpinnyBehaviour(obj, 0.01));
});

export const image = new Prefab(obj => {
    obj.scale(-1, 1);
    obj.setDisplay(new ImageDisplay(obj, Assets.img(Img.LEVELS_ICON)));
    obj.setBehaviour(new WigglyBehaviour(obj, 0.01));
});

export const sprite = new Prefab(obj => {
    obj.setDisplay(new SpriteDisplay(obj, 0, 0));
    obj.setBehaviour(new WigglyBehaviour(obj, 0.01));
});

export const yoloSprite = new Prefab(obj => {
    obj.setDisplay(new YoloSpritesheetDisplay(obj, new Spritesheet(Assets.img(Img.PLANKS_LG), 1, 24), 0, 23));
    obj.setBehaviour(new WigglyBehaviour(obj, -0.01));
});

export const dicedice = new Prefab(obj => {
    obj.setDisplay(new YoloSpritesheetDisplay(obj, new Spritesheet(Assets.img(Img.MISC_MD), 7, 3), 0, 5));
    obj.setBehaviour(new CircleBehaviour(obj, 1));
});

/*
export const square = new Prefab(obj => {
    obj.setDisplay(new SpinnyDisplay(obj, "#77FF77", 50));
    obj.setCollider(new SquareCollider(obj));
    obj.setBehaviour(new SpinnyBehaviour(obj, 0.01));
});

export const wanderer = new Prefab(obj => {
    obj.setDisplay(new SpinnyDisplay(obj, "#77FF77", 50));
    obj.setCollider(new SquareCollider(obj));
    obj.setBehaviour(new WandererBehaviour(obj, 0.01));
});
*/

/*
 oui c'est dégeulasse, j'ai pas trouvé de moyen de mettre des paramètres aux prefab
 mais est-ce qu'on en a besoin ?
 => toutes les boites en bois seront identiques
*/
export function createWiggly(scene: Scene, x: number, y: number, c: string = "#008000", a: number = 0.01, w: number = 50, h: number = 75) {
    let obj = scene.instantiate(wigglyThingy, x, y);
    let display = obj.getDisplay() as WigglyDisplay;
    display.height = h;
    display.width = w;
    display.color = c;

    let behaviour = obj.getBehaviour() as WigglyBehaviour;
    behaviour.rotation = a;
}