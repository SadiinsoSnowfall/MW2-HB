import { Widget } from "./widget";
import { drawRoundRect } from "../utils/drawutils";

export class CoverShape extends Widget {
    private color: string;
    private centered: boolean;

    private isRounded: boolean;
    private radius: [number, number, number, number];

    constructor(color: string) {
        super(0);
        this.color = color;
        this.centered = true
        this.doCaptureEvent = false;
        this.radius = [0, 0, 0, 0];
        this.isRounded = false;
    }

    public isCentered(): boolean {
        return this.centered;
    }

    public rounded(radius: number | [number, number, number, number]): CoverShape {
        if (Array.isArray(radius)) {
            this.radius = radius;
        } else {
            this.radius = [radius, radius, radius, radius];
        }
        
        this.isRounded = true;
        return this;
    }

    public setCentered(centered: boolean): CoverShape {
        this.centered = centered;
        return this;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        let x, y;

        if (this.centered) {
            x = this.pos.x - this.size.x / 2;
            y = this.pos.y - this.size.y / 2;
        } else {
            x = this.pos.x;
            y = this.pos.y;
        }

        if (this.isRounded) {
            drawRoundRect(ctx, x, y, this.size.x, this.size.y, this.radius, true);
        } else {
            ctx.fillRect(x, y, this.size.x, this.size.y);
        }
    }

    public hoverEnter(): void {
        this.hoverCallback();
    }

    public hoverLeft(): void {}

}