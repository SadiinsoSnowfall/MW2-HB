import { GameObject } from "../../engine/gameObject";
import { Display } from "../../engine/components/display";
import { Collider } from '../../engine/components/collider';
import { ConvexPolygon } from "../../engine/physics/convexPolygon";
import { Vec2 } from "../../engine/utils/vec2";

export type ParticleCreator = (x: number, y: number, amount: number, amplitude: number, lifespan?: number) => GameObject;

export class GroundDisplay extends Display {
    private w: number
    private h: number;
    private color: string;

    constructor(o: GameObject, w: number, h: number, color: string) {
        super(o);
        this.w = w;
        this.h = h;
        this.color = color;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w, -this.h, this.w * 2, this.h * 2);
    }
}

export function createGround(x: number, y: number, w: number, h: number, color: string = "#696969"): GameObject {
    w /= 2;
    h /= 2;

    let obj = new GameObject(x, y);

    obj.setDisplay(new GroundDisplay(obj, w, h, color));
    let collider = new Collider(obj, new ConvexPolygon(
        Vec2.Zero,
        [
            new Vec2(-w, -h),
            new Vec2(-w, h),
            new Vec2(w, h),
            new Vec2(w, -h)
        ]
    ));
    collider.setStatic(true);
    obj.setCollider(collider);

    return obj;
}