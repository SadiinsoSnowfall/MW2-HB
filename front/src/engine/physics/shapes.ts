import { Vec2, Transform } from "../utils";
import { assert } from "../../utils";

/**
 * Unused (as long there is only one shape class)
 */
/*export interface Shape {
    pointIn(point: Vec2): boolean;
    boundingBox(): Rectangle;
    transform(t: Transform): Shape;
}*/

/**
 * @brief Class for axis-aligned bounding boxes.
 * Though Rectangle is conceptually a Shape, it should not be used by GameObjects directly,
 * so it does not implement the interface.
 */
export class Rectangle {
    public readonly position: Vec2;
    public readonly width: number;
    public readonly height: number;

    constructor(position: Vec2, width: number, height: number) {
        assert(width >= 0 && height >= 0, `Rectangle#constructor: invalid dimensions (${width}, ${height})`);
        this.position = position;
        this.width = width;
        this.height = height;
    }

    /**
     * @brief Returns a string representation of this AABB.
     */
    public toString(): string {
        return `{x: ${this.position.x}, y: ${this.position.y}, width: ${this.width}, height: ${this.height}}`;
    }

    /**
     * @brief Returns whether or not point is in the AABB.
     */
    public pointIn(point: Vec2): boolean {
        return (point.x >= this.position.x && point.x < this.position.x + this.width)
            && (point.y >= this.position.y && point.y < this.position.y + this.height);
    }

    /**
     * @brief Returns whether or not this rectangle intersects with rect.
     */
    public intersects(rect: Rectangle): boolean {
        return (this.position.x <= rect.position.x + rect.width  && this.position.x + this.width  >= rect.position.x)
            && (this.position.y <= rect.position.y + rect.height && this.position.y + this.height >= rect.position.y);
    }

    /**
     * @brief Returns the bounding box that encompasses this and rect.
     */
    public merge(rect: Rectangle): Rectangle {
		let tr = this.position.x + this.width;
		let tb = this.position.y + this.height;
		let rr = rect.position.x + rect.width;
		let rb = rect.position.y + rect.height;
		
		let l = Math.min(rect.position.x, this.position.x);
		let r = Math.max(rr, tr);
		let t = Math.min(rect.position.y, this.position.y);
		let b = Math.max(rb, tb);
		return new Rectangle(new Vec2(l, t), r - l, b - t);
	}
}

/**
 * Unused; since objects can be scaled, so too should their hitboxes be.
 * A scaled circle is an ellipse, and ellipses are much more bothersome.
 * So we just decided that circles would be approximated by (convex) polygons,
 * which are scalable without issue.
 */
/*export class Circle implements Shape {
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
        let halfRadius = this.radius / 2;
        let doubleRadius = this.radius * 2;
        return new Rectangle(
            new Vec2(this.center.x - halfRadius, this.center.y - halfRadius),
            doubleRadius,
            doubleRadius
        );
    }
}*/

/**
 * @brief Class specialized in convex polygons.
 */
export class ConvexPolygon {
    private vertices: Vec2[];

    /**
     * @brief Given a list of vertices given counterclockwise, constructs a polygon.
     * No error is thrown if the vertices are not given in the right order,
     * however the behavior of this class' methods are unspecified.
     */
    constructor(vertices: Vec2[]) {
        assert(vertices.length >= 3, "ConvexPolygon#constructor: cannot make a polygone out of less than 3 vertices");
        this.vertices = vertices;
    }

    /**
     * @brief Returns whether or not point belongs in this shape.
     */
    public pointIn(point: Vec2): boolean {
        let a = this.vertices[0];
        for (let i = 1; i < this.vertices.length; i++) {
            let b = this.vertices[i];
            let det = (b.x - a.x) * (point.x - a.x) - (b.y - a.y) * (point.y - a.y);
            a = b;
            if (det < 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * @brief Returns the smallest AABB that contains the entire polygon.
     */
    public boundingBox(): Rectangle {
        let xmax = this.vertices[0].x;
        let xmin = xmax;
        let ymax = this.vertices[0].y;
        let ymin = ymax;

        for (let v of this.vertices) {
            if (v.x > xmax) {
                xmax = v.x;
            } else if (v.x < xmin) {
                xmin = v.x;
            }

            if (v.y > ymax) {
                ymax = v.y;
            } else if (v.y < ymin) {
                ymin = v.y;
            }
        }

        return new Rectangle(new Vec2(xmin, ymin), xmax - xmin, ymax - ymin);
    }


    /**
     * @brief Returns null if this and other are not colliding.
     * Otherwise, returns the penetration vector.
     */
    public collides(other: ConvexPolygon): Vec2 | null {
        return null;
    }
}