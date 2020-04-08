import { GameObject } from "../../engine/gameObject";
import { Display, Collider } from "../../engine/components";
import { Rectangle, ConvexPolygon } from "../../engine/shapes";
import { Vec2 } from "../../engine/utils";

export class GroundDisplay extends Display {
    private w: number
    private h: number;

    constructor(o: GameObject, w: number, h: number) {
        super(o);
        this.w = w;
        this.h = h;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "#696969";
        ctx.fillRect(-this.w, -this.h, this.w * 2, this.h * 2);
    }
}

export function createGround(x: number, y: number, w: number, h: number): GameObject {
    w /= 2;
    h /= 2;

    let obj = new GameObject(x, y);

    obj.setDisplay(new GroundDisplay(obj, w, h));
    obj.setCollider(new Collider(obj, new ConvexPolygon(
        Vec2.Zero,
        [
            new Vec2(-w, -h),
            new Vec2(-w, h),
            new Vec2(w, h),
            new Vec2(w, -h)
        ]
    )));
    return obj;
}