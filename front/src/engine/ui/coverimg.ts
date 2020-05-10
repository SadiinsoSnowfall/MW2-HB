import { Widget } from "./widget";
import { Sprite } from "../utils/spritesheet";
import { Vec2 } from "../utils/vec2";

export class CoverImg extends Widget {
    private sprite: Sprite;
    private centered: boolean;
    private scaleFactor: number = 1;

    constructor(sprite: Sprite) {
        super(0, Vec2.Zero.clone(), sprite.getSize());
        this.sprite = sprite;
        this.centered = true;
        this.doCaptureEvent = false;
    }

    public scale(factor: number): CoverImg {
        this.scaleFactor = factor;
        return this;
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
        if (this.scaleFactor == 1) {
            if (this.centered) {
                this.sprite.draw(ctx, this.pos.x, this.pos.y);
            } else {
                const tlx = this.size.x / 2;
                const tly = this.size.y / 2;
                ctx.translate(-tlx, -tly);
                this.sprite.draw(ctx, this.pos.x, this.pos.y);
            }
        } else {
            ctx.save();

            if (this.centered) {
                ctx.translate(this.pos.x, this.pos.y);
                ctx.scale(this.scaleFactor, this.scaleFactor);
                this.sprite.draw(ctx);
            } else {
                throw new Error("coverImg scale+nocenter not implemented");
            }

            ctx.restore();
        }
    }

    public hoverEnter(): void {
        this.hoverCallback();
    }

    public hoverLeft(): void {}

}