
/**
 * @brief Represents a spritesheet.
 * A spritesheet is basically a collection of images (Sprite) referenced by a 2D coordinate system.
 */
export class Spritesheet {
    private readonly image: HTMLImageElement;
    private readonly divh: number;
    private readonly divv: number;

    /**
     * @brief Constructs a spritesheet.
     * @param image The source image
     * @param horizontalDivisions Number of horizontal divisions
     * @param verticalDivisions Number of vertical divisions
     */
    constructor(image: HTMLImageElement, horizontalDivisions: number, verticalDivisions: number) {
        if (horizontalDivisions <= 0 || verticalDivisions <= 0) {
            throw new Error("Spritesheet.constructor: invalid divisions (" + horizontalDivisions + ", " + verticalDivisions + ")");
        }
        this.image = image;
        this.divh = horizontalDivisions;
        this.divv = verticalDivisions;
    }

    /**
     * @brief Returns the source image.
     */
    public getImage(): HTMLImageElement {
        return this.image;
    }

    /** 
     * @brief Returns the sprite at the given position.
     */
    public getSprite(x: number, y: number): Sprite {
        let w = this.image.width / this.divh;
        let h = this.image.height / this.divv;
        return new Sprite(this.image, w * x, h * y, w, h);
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
     * @brief Draws the sprite centered on (0,0) (relative to the current transform)
     */
    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h, -this.w/2, -this.h/2, this.w, this.h);
    }
}