import { Vec2, Transform, assert } from "../utils";
import { Shape, drawCross, Rectangle } from '.';

/**
 * @brief A circle.
 * Circles can be scaled differently in both dimensions without issue.
 * The only limitation is that one can not create an ellipse directly:
 * instead, a circle must be created first and then scaled properly.
 * Since there is only one transformation matrix per object for now
 * (i.e. displays and colliders share the same matrix), it can be bothersome.
 * The game should not contain any elliptic objects though so that's no issue in our case.
 */
export class Circle implements Shape {
    private center: Vec2;
    private radius: number;

    constructor(center: Vec2, radius: number) {
        assert(radius >= 0, `Sphere#constructor: invalid radius ${radius}`);
        this.center = center;
        this.radius = radius;
    }

    public pointIn(point: Vec2): boolean {
        let x = point.x - this.center.x;
        let y = point.y - this.center.y;
        return this.radius * this.radius >= x * x + y * y;
    }

    public boundingBox(): Rectangle {
        let doubleRadius = this.radius * 2;
        return new Rectangle(
            new Vec2(this.center.x - this.radius, this.center.y - this.radius),
            doubleRadius,
            doubleRadius
        );
    }

    public transform(t: Transform): Circle {
        // Wrong, of course: this.radius should be affected by the scale
        // (and because the scale might affect differently the radius depending on the direction,
        // it should return an ellipse rather than a circle)
        return new Circle(t.multiplyVector(this.center), this.radius);
    }

    public support(d: Vec2): Vec2 {
        if (d.eq(Vec2.Zero)) {
            // Vec2.Zero or this.center? Not sure
            return this.center;
        } else {
            let magnitude = d.magnitude();
            let r = Vec2.mul(d, this.radius / magnitude);
            r.add(this.center);
            return r;
        }
    }

    public feature(d: Vec2): Vec2 {
        return this.support(d);
    }

    public pick(): Vec2 {
        return new Vec2(this.center.x + this.radius, this.center.y);
    }

    public stroke(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        drawCross(ctx, this.center);
    }

    public fill(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(
            this.center.x, this.center.y, 
            this.radius, this.radius,
            0, 0, 2 * Math.PI
        );
        ctx.closePath();
        ctx.fill();
    }
}