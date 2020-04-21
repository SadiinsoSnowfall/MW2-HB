import { Widget } from ".";
import { Sprite, Vec2 } from "../utils";

export class CoverImg extends Widget {
    private sprite: Sprite;
    private centered: boolean;

    constructor(sprite: Sprite) {
        super(0, Vec2.Zero.clone(), sprite.getSize());
        this.sprite = sprite;
        this.centered = true;
        this.doCaptureEvent = false;
    }

    public centerOn(w: Widget): CoverImg {
        this.setPosition(w.getPosition());
        this.centered = true;
        return this;
    }

    public isCentered(): boolean {
        return this.centered;
    }

    public setCentered(centered: boolean): CoverImg {
        this.centered = centered;
        return this;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.centered) {
            this.sprite.draw(ctx, this.pos.x, this.pos.y);
        } else {
            const tlx = this.size.x / 2;
            const tly = this.size.y / 2;
            ctx.translate(-tlx, -tly);
            this.sprite.draw(ctx, this.pos.x, this.pos.y);
        }
    }

    public hoverEnter(): void {
        this.hoverCallback();
    }

    public hoverLeft(): void {}

}