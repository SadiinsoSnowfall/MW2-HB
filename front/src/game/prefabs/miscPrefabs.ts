import { Prefab } from "../../engine/prefab";
import { SlingshotDisplay, SlingshotBehaviour } from "../components/miscComponents";


export const slingshot = new Prefab(obj => {
    obj.setDisplay(new SlingshotDisplay(obj));
    obj.setBehaviour(new SlingshotBehaviour(obj));
});