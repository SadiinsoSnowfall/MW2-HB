import { Display } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";

/**
 * Virtual Spritesheet Block Display
 * 
 * take a spritesheet and a collumn index
 */
export class VSBlockDisplay extends Display {
    private sheet: Spritesheet;
    private col: number;
    private row: number;
    private sprite: Sprite;

    constructor(o: GameObject, sheet: Spritesheet, col: number) {
        super(o);
        this.sheet = sheet;
        this.col = col;
        this.row = 0;
        this.sprite = sheet.getSprite(this.col, this.row)
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }

}