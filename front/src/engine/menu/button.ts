import { Sprite, Vec2 } from "../utils";
import { Widget } from "./widget";

export class Button extends Widget {
    private sprite: Sprite;

    constructor(sprite: Sprite, pos: Vec2 = Vec2.Zero) {
        super(pos);
        this.sprite = sprite;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx, this.pos.x, this.pos.y);
    }

}