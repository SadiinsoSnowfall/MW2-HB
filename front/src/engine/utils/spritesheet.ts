import { Assets } from "../../utils";

/**
 * @brief Represents a spritesheet.
 * A spritesheet is basically a collection of images (Sprite) referenced by a 2D coordinate system.
 */
export class Spritesheet {
    private readonly image: HTMLImageElement;
    private readonly divh: number;
    private readonly divv: number;
    private readonly sH: number; // sprite height
    private readonly sW: number; // sprite width

    /**
     * @brief Constructs a spritesheet.
     * @param image The source image
     * @param horizontalDivisions Number of horizontal divisions
     * @param verticalDivisions Number of vertical divisions
     */
    constructor(image: HTMLImageElement, horizontalDivisions: number, verticalDivisions: number) {
        if (horizontalDivisions <= 0 || verticalDivisions <= 0) {
            throw new Error(`Spritesheet#constructor: invalid divisions (${horizontalDivisions}, ${verticalDivisions})`);
        }
        this.image = image;
        this.divh = horizontalDivisions;
        this.divv = verticalDivisions;
        this.sH = this.image.height / this.divh;
        this.sW = this.image.width / this.divv;
    }

    /**
     * @brief Returns the source image.
     */
    public getImage(): HTMLImageElement {
        return this.image;
    }

    /**
     * @brif Returns the number of horizontal divisions
     */
    public hDiv(): number {
        return this.divh;
    }

    /**
     * @brif Returns the number of vertical divisions
     */
    public vDiv(): number {
        return this.divv;
    }

    /**
     * @brief Returns the number of sprites on this spritesheet
     */
    public spriteCount(): number {
        return this.divh * this.divv;
    }
    
    /**
     * Return the sprite at the given index
     * @param index The sprite index
     */
    public getSpriteAbsolute(index: number): Sprite {
        return this.getSprite(index % this.divh, Math.floor(index / this.divh));
    }

    /** 
     * @brief Returns the sprite at the given position.
     */
    public getSprite(x: number, y: number): Sprite {
        return new Sprite(this.image, this.sW * x, this.sH * y, this.sW, this.sH);
    }
}

/**
 * @brief Acts as an image.
 */
export class Sprite {
    private image: HTMLImageElement;
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    /**
     * Not meant to be used outside of this file.
     */
    constructor(image: HTMLImageElement, x: number, y: number, w: number, h: number) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * @brief Creates a sprite from the entirety of an image.
     */
    public static fromSource(image: HTMLImageElement): Sprite {
        return new Sprite(image, 0, 0, image.width, image.height);
    }

    /**
     * @brief Draws the sprite centered on (dx=0,dy=0) (relative to the current transform)
     */
    public draw(ctx: CanvasRenderingContext2D, dx: number = 0, dy: number = 0): void {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h, dx-this.w/2, dy-this.h/2, this.w, this.h);
    }
}

/**
 * Spritesheet Map wrapper to manage lazy loading of spritesheets
 */
export class SSManager {
    private static sheets: Map<[string, number, number], Spritesheet> = new Map();

    public static get(img: string, hdiv: number, vdiv: number): Spritesheet {
        const query: [string, number, number] = [img, hdiv, vdiv];

        /*
            As the map will not contains any undefined|null-mapped keys, it is
            safe to use the get-then-check pattern instead of has-then-get
        */
        let sheet = SSManager.sheets.get(query);
        if (sheet === undefined) {
            sheet = new Spritesheet(Assets.img(img), hdiv, vdiv);
            SSManager.sheets.set(query, sheet);
        }

        return sheet;
    }
}