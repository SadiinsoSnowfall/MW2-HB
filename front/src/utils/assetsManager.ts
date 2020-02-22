import { assert } from "./";

export class Assets {
    private static assetsLoaded: boolean = false;
    private static imgs = new Map<string, HTMLImageElement>();

    public static img(img: string): HTMLImageElement {
        const res = Assets.imgs.get(img);
        assert(res !== undefined, 'Assets#img undefined ressource');
        return res as HTMLImageElement;
    }

    public static load(): Promise<unknown> {
        assert(Assets.assetsLoaded == false, "More than one call to Assets#load");
        Assets.assetsLoaded = true;
        return Promise.all(Object.values(Img).map(Assets.loadImage));
    }

    private static loadImage(url: string): Promise<void> {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                Assets.imgs.set(url, img);
                resolve();
            };
            img.src = url;
        });
    }

}

export const Sound = Object.freeze({
    MAIN: require('assets/music/title_theme.ogg'),
    MAIN_REMIX: require('assets/music/SSvsAB_remix.ogg'),
});

export const Img = Object.freeze({
    LEVELS_ICON: require('assets/images/levels_icon.png'),

    MISC_MD: require('assets/images/misc_md.png'),
    MISC_LG: require('assets/images/misc_lg.png'),
    MISC_XL: require('assets/images/misc_xl.png'),
    MISC_XLV: require('assets/images/misc_xlv.png'),

    BALLS_MD: require('assets/images/balls_md.png'),
    BALLS_SM: require('assets/images/balls_sm.png'),

    CUBES_MD: require('assets/images/cubes_md.png'),
    CUBES_SM: require('assets/images/cubes_sm.png'),
    CUBES_XS: require('assets/images/cubes_xs.png'),
    CUBES_HOLLOW: require('assets/images/cubes_hollow.png'),

    TRIS_MD: require('assets/images/tris_md.png'),
    TRIS_SM: require('assets/images/tris_sm.png'),
    TRIS_HOLLOW: require('assets/images/tris_hollow.png'),
    
    FAT_PLANKS: require('assets/images/large_planks.png'),
    PLANKS_XL: require('assets/images/planks_xl.png'),
    PLANKS_LG: require('assets/images/planks_lg.png'),
    PLANKS_MD: require('assets/images/planks_md.png'),
    PLANKS_SM: require('assets/images/planks_sm.png'),
    PLANKS_XS: require('assets/images/planks_xs.png'),
});