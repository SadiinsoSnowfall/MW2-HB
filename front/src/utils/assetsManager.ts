import { assert } from "./";

export class Assets {
    private static assetsLoaded: boolean = false;
    private static assets = new Map<string, HTMLImageElement>(); 

    public static get(img: string): HTMLImageElement {
        const res = Assets.assets.get(img);
        assert(res !== undefined, 'Assets#get undefined ressource ');
        return res as HTMLImageElement;
    }

    public static load(): Promise<unknown> {
        assert(this.assetsLoaded == false, "More than one call to Assets#load");
        this.assetsLoaded = true;
        return Promise.all(Object.values(Img).map(this.loadImage));
    }

    private static loadImage(url: string): Promise<void> {
        return new Promise(resolve => {
            let img = new Image();
            img.onload = () => {
                Assets.assets.set(url, img);
                resolve();
            };
            img.src = url;
        });
    }

}

export const Img = Object.freeze({
    LEVELS_ICON:  require('assets/images/levels_icon.png'),
    MISC_MD:  require('assets/images/misc_md.png'),
    MISC_LG:  require('assets/images/misc_lg.png'),
    MISC_XL:  require('assets/images/misc_xl.png'),
    MISC_XLV:  require('assets/images/misc_xlv.png'),
    BALLS:  require('assets/images/balls.png'),
    BALLS_SM:  require('assets/images/balls_sm.png'),
    CUBES:  require('assets/images/cubes.png'),
    TRIS:  require('assets/images/tris.png'),
    FAT_PLANKS:  require('assets/images/large_planks.png'),
    PLANKS_XL:  require('assets/images/planks_xl.png'),
    PLANKS_LG:  require('assets/images/planks_lg.png'),
    PLANKS_MD:  require('assets/images/planks_md.png'),
    PLANKS_SM:  require('assets/images/planks_sm.png'),
    PLANKS_XS:  require('assets/images/planks_xs.png'),
});