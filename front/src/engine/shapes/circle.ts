import { Vec2, Transform } from "../utils";
import { Shape, drawCross } from './shapes';
import { Rectangle } from './rectangle';
import { assert } from '../../utils';

/**
 * Unused; since objects can be scaled, so too should their hitboxes be.
 * A scaled circle is an ellipse, and ellipses are much more bothersome.
 * So we just decided that circles would be approximated by (convex) polygons,
 * which are scalable without issue.
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

/**
 * @brief Oriented ellipse.
 */
export class Ellipse implements Shape {
    /*
     * These attributes are not all necessary.
     * We could manage with either:
     * - center, x and y (x and y are the point at the end of their respective radius, rotated)
     * - center, both radii, and angle
     * Some methods are faster to compute with one system, some methods are faster with the other,
     * and stroke() and fill() require the latter, or at least a way to convert the former into it.
     * Since the attributes can not change dynamically, we use both.
     * Of course this could change over the course of development if we find a better way to handle ellipses.
     */
    private center: Vec2;
    private x: Vec2;
    private y: Vec2;
    private radiusX: number;
    private radiusY: number;
    private angle: number;

    /**
     * @brief To be used in place of the constructor.
     * @param center Center of the ellipse
     * @param radiusX Radius along the x axis (if angle were to be 0)
     * @param radiusY Radius along the y axis
     * @param radians Orientation, in radians
     */
    public static create(center: Vec2, radiusX: number, radiusY: number, radians: number): Ellipse {
        let xy = [
            new Vec2(radiusX + center.x, center.y),
            new Vec2(center.x, radiusY + center.y)
        ];
        xy = Vec2.rotateMultiple(xy, radians);
        return new Ellipse(center, radiusX, radiusY, radians, xy[0], xy[1]);
    }

    /**
     * @brief Private constructor.
     * Use create() instead.
     * Private for optimization issues but I don't think it's actually beneficial 
     * since the gain is marginal, if it exists at all...
     */
    private constructor(center: Vec2, radiusX: number, radiusY: number, radians: number, x: Vec2, y: Vec2) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.angle = radians;
        this.x = x;
        this.y = y;
    }

    public pointIn(p: Vec2): boolean {
        let cp = Vec2.sub(p, this.center);
        let cq = Vec2.rotate(cp, -this.angle);
        return (cq.x * cq.x) / (this.radiusX * this.radiusX)
             + (cq.y * cq.y) / (this.radiusY * this.radiusY)
             <= 1;
    }

    public boundingBox(): Rectangle {
        let cy = Vec2.sub(this.y, this.center);
        let xc = Vec2.sub(this.center, this.x);
        let yc = Vec2.neg(cy);

        return Rectangle.bound([
            Vec2.add(this.x, cy),
            Vec2.add(this.x, yc),
            Vec2.add(this.center, Vec2.add(xc, cy)),
            Vec2.add(this.center, Vec2.add(xc, yc))
        ]);
    }

    public transform(transform: Transform): Ellipse {
        let center = transform.multiplyVector(this.center);
        let x = transform.multiplyVector(this.x);
        let y = transform.multiplyVector(this.y);
        let radiusX = Vec2.sub(x, center).magnitude();
        let radiusY = Vec2.sub(y, center).magnitude();
        let angle = transform.getRotation();
        return new Ellipse(center, radiusX, radiusY, this.angle + angle, x, y);
    }

    public support(d: Vec2): Vec2 {
        return Vec2.Zero; // TODO
    }

    public pick(): Vec2 {
        return Vec2.add(Vec2.rotate(new Vec2(this.radiusX, 0), this.angle), this.center);
    }

    public stroke(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y,
            this.radiusX, this.radiusY,
            this.angle, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }

    public fill(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y,
            this.radiusX, this.radiusY,
            this.angle, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}