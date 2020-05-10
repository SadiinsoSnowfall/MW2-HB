import { Prefab } from "../../engine/prefab";
import { SlingshotDisplay, SlingshotBehaviour } from "../components/miscComponents";
import { PrefabsManager } from "../../engine/res/prefabsManager";


export namespace MiscPrefabs {

    export function init() {}

    export const slingshot = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new SlingshotDisplay(obj));
        obj.setBehaviour(new SlingshotBehaviour(obj));
    }), 10);

}