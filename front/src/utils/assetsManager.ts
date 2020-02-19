import { assert } from "./";

export class Assets {
    private static assetsLoaded: boolean = false;
    private static assets = new Map<string, HTMLImageElement>(); 

    static readonly LEVELS_ICON = require('assets/images/levels_icon.png').default as string
    static readonly MISC_MD = require('assets/images/misc_md.png').default as string
    static readonly MISC_LG = require('assets/images/misc_lg.png').default as string
    static readonly MISC_XL = require('assets/images/misc_xl.png').default as string
    static readonly MISC_XLV = require('assets/images/misc_xlv.png').default as string
    static readonly BALLS = require('assets/images/balls.png').default as string
    static readonly BALLS_SM = require('assets/images/balls_sm.png').default as string
    static readonly CUBES = require('assets/images/cubes.png').default as string
    static readonly TRIS = require('assets/images/tris.png').default as string
    static readonly FAT_PLANKS = require('assets/images/large_planks.png').default as string
    static readonly PLANKS_XL = require('assets/images/planks_xl.png').default as string
    static readonly PLANKS_LG = require('assets/images/planks_lg.png').default as string
    static readonly PLANKS_MD = require('assets/images/planks_md.png').default as string
    static readonly PLANKS_SM = require('assets/images/planks_sm.png').default as string
    static readonly PLANKS_XS = require('assets/images/planks_xs.png').default as string

    public static get(url: string): HTMLImageElement {
        return Assets.assets.get(url) as HTMLImageElement;
    }

    public static load(): Promise<unknown> {
        assert(this.assetsLoaded == false, "More than one call to Assets#load");
        this.assetsLoaded = true;

        return Promise.all([
            this.LEVELS_ICON,
            this.MISC_MD,
            this.MISC_LG,
            this.MISC_XL,
            this.MISC_XLV,
            this.BALLS,
            this.BALLS_SM,
            this.CUBES,
            this.TRIS,
            this.FAT_PLANKS,
            this.PLANKS_XL,
            this.PLANKS_LG,
            this.PLANKS_MD,
            this.PLANKS_SM,
            this.PLANKS_XS,
        ].map(this.loadImage));
    }

    static loadImage(url: string): Promise<void> {
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
