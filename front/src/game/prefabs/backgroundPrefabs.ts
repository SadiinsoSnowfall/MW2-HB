import { Prefab } from "../../engine/prefab";
import { PrefabsManager } from '../../engine/res/prefabsManager';
import { BackgroundDisplay } from "../components/backgroundComponent";
import { Img } from "../../engine/res/assetsManager";


export namespace BackgroundPrefabs {

    const beach_images: string[] = [
        Img.BEACH_BACK_1,
        Img.BEACH_BACK_2,
        Img.BEACH_PARA_1,
        Img.BEACH_PARA_2,
        Img.BEACH_PARA_3,
    ]

    export const back_test = PrefabsManager.register(new Prefab(obj => {
        obj.setDisplay(new BackgroundDisplay(obj, beach_images));
    }), 11);

}