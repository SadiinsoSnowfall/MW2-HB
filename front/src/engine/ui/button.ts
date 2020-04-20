import { Sprite, Vec2 } from "../utils";
import { Widget } from "./widget";
import { screen } from "../screen";
import { Assets, Img } from "../res";

export class Button extends Widget {
    private sprite: Sprite;

    private scaleFactor: number = 1;
    private static hoverScaleFactor = 1.1;

    constructor(sprite: Sprite, pos: Vec2 = Vec2.Zero.clone()) {
        super(1, pos, sprite.getSize());
        this.sprite = sprite;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.scaleFactor != 1) {
            ctx.save();
            ctx.translate(this.pos.x, this.pos.y);
            ctx.scale(this.scaleFactor, this.scaleFactor);
            this.sprite.draw(ctx);
            ctx.restore();
        } else {
            this.sprite.draw(ctx, this.pos.x, this.pos.y);
        }
    }

    public hoverEnter(): void {
        this.hoverCallback(); // execute callback
        screen.setCursor(Assets.img(Img.POINTER));
        this.scaleFactor *= Button.hoverScaleFactor;
    }

    public hoverLeft(): void {
        screen.setCursor(Assets.img(Img.CURSOR));
        this.scaleFactor /= Button.hoverScaleFactor;
    }

}