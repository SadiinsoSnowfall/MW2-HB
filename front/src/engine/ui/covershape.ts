import { Element, Widget } from ".";

export class CoverShape extends Widget {
    private color: string;
    private centered: boolean;

    constructor(color: string) {
        super(0);
        this.color = color;
        this.centered = false;
    }

    public isCentered(): boolean {
        return this.centered;
    }

    public setCentered(centered: boolean): CoverShape {
        this.centered = centered;
        return this;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;

        if (this.centered) {
            const dx = this.pos.x - this.size.x / 2;
            const dy = this.pos.y - this.size.y / 2;
            ctx.fillRect(dx, dy, this.size.x, this.size.y);
        } else {
            ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        }
    }

    public hoverEnter(): void {
        this.hoverCallback();
    }

    public hoverLeft(): void {}

}