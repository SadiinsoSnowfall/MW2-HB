import { Prefab } from "../../engine/prefab";
import { SpinnyDisplay, SpinnyBehaviour, WigglyDisplay, WigglyBehaviour, FPSMetterDisplay, ImageDisplay, SpriteDisplay, YoloSpritesheetDisplay, CircleBehaviour } from "../components/debugComponents";
import { Alignment, Style } from "../../engine/utils/textFormat";
import { Scene } from "../../engine/scene";
import { Assets, Img } from "../../utils";
import { Spritesheet } from "../../engine/utils/spritesheet";

export { wigglyThingy, spinnyThingy, FPSMetter, funnyFPSMetter, hilariousFPSMetter, image, sprite, yoloSprite, dicedice };

const wigglyThingy = new Prefab(obj => {
    obj.setDisplayComponent(new WigglyDisplay(obj, "#008000", 100, 55));
    obj.setBehaviourComponent(new WigglyBehaviour(obj, 0.0075));
});

const spinnyThingy = new Prefab(obj => {
    obj.setDisplayComponent(new SpinnyDisplay(obj, "#008000", 50));
    obj.setBehaviourComponent(new SpinnyBehaviour(obj, 0.01));
});

const FPSMetter = new Prefab(obj => {
    obj.setDisplayComponent(new FPSMetterDisplay(obj, Alignment.Left, Style.Fill));
});

const funnyFPSMetter = new Prefab(obj => {
    obj.setDisplayComponent(new FPSMetterDisplay(obj, Alignment.Centered, Style.Fill));
    obj.setBehaviourComponent(new WigglyBehaviour(obj, 0.01));
});

const hilariousFPSMetter = new Prefab(obj => {
    obj.setDisplayComponent(new FPSMetterDisplay(obj, Alignment.Right, Style.Stroke));
    obj.setBehaviourComponent(new SpinnyBehaviour(obj, 0.01));
});

const image = new Prefab(obj => {
    obj.setDisplayComponent(new ImageDisplay(obj, Assets.img(Img.LEVELS_ICON)));
    obj.setBehaviourComponent(new WigglyBehaviour(obj, 0.01));
});

const sprite = new Prefab(obj => {
    obj.setDisplayComponent(new SpriteDisplay(obj, 0, 0));
    obj.setBehaviourComponent(new WigglyBehaviour(obj, 0.01));
});

const yoloSprite = new Prefab(obj => {
    obj.setDisplayComponent(new YoloSpritesheetDisplay(obj, new Spritesheet(Assets.img(Img.PLANKS_LG), 1, 24), 0, 23));
    obj.setBehaviourComponent(new WigglyBehaviour(obj, -0.01));
});

const dicedice = new Prefab(obj => {
    obj.setDisplayComponent(new YoloSpritesheetDisplay(obj, new Spritesheet(Assets.img(Img.MISC_MD), 7, 3), 0, 5));
    obj.setBehaviourComponent(new CircleBehaviour(obj, 1));
});

/*
 oui c'est dégeulasse, j'ai pas trouvé de moyen de mettre des paramètres aux prefab
 mais est-ce qu'on en a besoin ?
 => toutes les boites en bois seront identiques
*/
export function createWiggly(scene: Scene, x: number, y: number, c: string = "#008000", a: number = 0.01, w: number = 50, h: number = 75) {
    let obj = scene.instantiate(wigglyThingy, x, y);
    let display = obj.displayComponent() as WigglyDisplay;
    display.height = h;
    display.width = w;
    display.color = c;

    let behaviour = obj.behaviourComponent() as WigglyBehaviour;
    behaviour.rotation = a;
}