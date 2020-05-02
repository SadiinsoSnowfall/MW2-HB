import { Display, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { SSManager, Sprite, Vec2, inRect } from "../../engine/utils";
import { Img, Inputs, MouseAction } from "../../engine/res";


export class SlingshotDisplay extends Display {
    private s_neutral: Sprite;
    private s_base: Sprite;
    private s_arm: Sprite;

    private dp: [number, number] | null = null;

    constructor(o: GameObject) {
        super(o);
        const sheet = SSManager.get(Img.MISC_XLV, 5, 2);
        this.s_neutral = sheet.getSprite(0, 0);
        this.s_base = sheet.getSprite(1, 0);
        this.s_arm = sheet.getSprite(2, 0);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.dp) {
            const [x, y] = this.object.getPositionXY();
            const [dx, dy] = this.dp;
            const px = dx - x;
            const py = dy - y;

            // draw stuff
            ctx.strokeStyle = ctx.fillStyle = "#54270F";
            ctx.fillRect(px - 10, py - 10, 20, 20);
            ctx.lineWidth = 15;

            // first line
            ctx.strokeStyle = ctx.fillStyle = "#301608";
            ctx.beginPath();
            ctx.moveTo(25, -65);
            ctx.lineTo(px, py);
            ctx.stroke();

            this.s_neutral.draw(ctx, -2, 1);

            // second line
            ctx.strokeStyle = ctx.fillStyle = "#54270F";
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(-10, -60);
            ctx.stroke();
        } else {
            // draw first part
            this.s_base.draw(ctx, 30, 0);
            // draw second part
            this.s_arm.draw(ctx, 3, -42);
        }
    }

    public setDragPoint(p: [number, number] | null): void {
        this.dp = p;
    }

}

export class SlingshotBehaviour extends Behaviour {
    private sd: SlingshotDisplay;
    private clickBegin: Vec2 | null = null;

    constructor(o: GameObject) {
        super(o);
        this.sd = o.getDisplay() as SlingshotDisplay;
        this.setClickable();
    }

    public update(): void {

    }

    public isInside(p: Vec2): boolean {
        const [x, y] = this.object.getPositionXY();
        return inRect(p.x, p.y, x - 50, y - 100, 100, 200);
    }

    public onMouseMove(p: Vec2): void {
        if (this.clickBegin) {
            this.sd.setDragPoint(p.XY());
        }
    }

    public onMouseDown(p: Vec2): void {
        this.clickBegin = p.clone();
    }

    public onMouseUp(p: Vec2): void {
        this.clickBegin = null;
        this.sd.setDragPoint(null);
    }

}