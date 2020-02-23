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
    LEVELS_ICON: require('assets/images/blocks/levels_icon.png'),

    MISC_MD: require('assets/images/blocks/misc_md.png'),
    MISC_LG: require('assets/images/blocks/misc_lg.png'),
    MISC_XL: require('assets/images/blocks/misc_xl.png'),
    MISC_XLV: require('assets/images/blocks/misc_xlv.png'),

    BALLS_MD: require('assets/images/blocks/balls_md.png'),
    BALLS_SM: require('assets/images/blocks/balls_sm.png'),

    CUBES_MD: require('assets/images/blocks/cubes_md.png'),
    CUBES_SM: require('assets/images/blocks/cubes_sm.png'),
    CUBES_XS: require('assets/images/blocks/cubes_xs.png'),
    CUBES_HOLLOW: require('assets/images/blocks/cubes_hollow.png'),

    TRIS_MD: require('assets/images/blocks/tris_md.png'),
    TRIS_SM: require('assets/images/blocks/tris_sm.png'),
    TRIS_HOLLOW: require('assets/images/blocks/tris_hollow.png'),
    
    FAT_PLANKS: require('assets/images/blocks/large_planks.png'),
    PLANKS_XL: require('assets/images/blocks/planks_xl.png'),
    PLANKS_LG: require('assets/images/blocks/planks_lg.png'),
    PLANKS_MD: require('assets/images/blocks/planks_md.png'),
    PLANKS_SM: require('assets/images/blocks/planks_sm.png'),
    PLANKS_XS: require('assets/images/blocks/planks_xs.png'),

    BIRD_RED: require('assets/images/characters/red.png'),
    BIRD_YELLOW: require('assets/images/characters/yellow.png'),
    BIRD_BLUE: require('assets/images/characters/blue.png'),
    BIRD_BLACK: require('assets/images/characters/black.png'),
    BIRD_WHITE: require('assets/images/characters/white.png'),
    BIRD_GREEN: require('assets/images/characters/green.png'),
    BIRD_BIG: require('assets/images/characters/big.png'),

    SCORES: require('assets/images/particles/scores.png'),
    SMOKE: require('assets/images/particles/smoke.png'),
    DEBRIS: require('assets/images/particles/debris.png'),
    FEATHERS: require('assets/images/particles/feathers.png'),
    EXPLOSION: require('assets/images/particles/explosion.png'),
});