import { Vec2, Transform } from "../utils";
import { Shape, Rectangle, drawCross } from './shapes';
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

export class Ellipse implements Shape {
    private center: Vec2;
    private radiusX: number;
    private radiusY: number;
    private angle: number;

    /**
     * @brief Constructor.
     * @param center Center of the ellipse
     * @param radiusX Radius along the x axis (if angle were to be 0)
     * @param radiusY Radius along the y axis
     * @param radians Orientation, in radians
     */
    constructor(center: Vec2, radiusX: number, radiusY: number, radians: number) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.angle = radians;
    }

    public pointIn(p: Vec2): boolean {
        let cp = Vec2.sub(p, this.center);
        let cq = Vec2.rotate(cp, -this.angle);
        return (cq.x * cq.x) / (this.radiusX * this.radiusX)
             + (cq.y * cq.y) / (this.radiusY * this.radiusY)
             <= 1;
    }

    public boundingBox(): Rectangle {

    }

    public transform(transform: Transform): Ellipse {
        
    }

    public support(d: Vec2): Vec2 {

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
     * @brief Constructor.
     * @param center Center of the ellipse
     * @param radiusX Radius along the x axis (if angle were to be 0)
     * @param radiusY Radius along the y axis
     * @param radians Orientation, in radians
     */
    constructor(center: Vec2, radiusX: number, radiusY: number, radians: number) {
        this.center = center;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.angle = radians;

        let xy = [
            new Vec2(radiusX + this.center.x, this.center.y),
            new Vec2(this.center.x, radiusY + this.center.y)
        ];
        xy = Vec2.rotateMultiple(xy, radians);
        this.x = xy[0];
        this.y = xy[1];
    }

    public pointIn(p: Vec2): boolean {
        let cp = Vec2.sub(p, this.center);
        let cq = Vec2.rotate(cp, -this.angle);
        return (cq.x * cq.x) / (this.radiusX * this.radiusX)
             + (cq.y * cq.y) / (this.radiusY * this.radiusY)
             <= 1;
    }

    public boundingBox(): Rectangle {

    }

    public transform(transform: Transform): Ellipse {
        
    }

    public support(d: Vec2): Vec2 {

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