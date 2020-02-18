import { assert } from "./";

export class Assets {
    private static assetsLoaded: boolean = false;
    private static assets = new Map<string, HTMLImageElement>(); 

    static readonly LEVELS_ICON = require('assets/images/levels_icon.png').default as string
    static readonly PLANKS_LONG = require('assets/images/planks_long.png').default as string

    public static get(url: string): HTMLImageElement {
        return Assets.assets.get(url) as HTMLImageElement;
    }

    public static load(): Promise<unknown> {
        assert(this.assetsLoaded == false, "More than one call to Assets#load");
        this.assetsLoaded = true;

        return Promise.all([
            this.LEVELS_ICON,
            this.PLANKS_LONG,
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
