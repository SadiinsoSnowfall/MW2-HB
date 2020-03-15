import { Vec2, Transform } from "../utils";
import { assert } from "../../utils";

/**
 * @brief Interface for all classes that can be used as shapes.
 */
export interface Shape {
    /**
     * @brief Returns whether or not point belongs in the shape.
     */
    pointIn(point: Vec2): boolean;

    /**
     * @brief Returns the smallest AABB that contains the entire shape.
     */
    boundingBox(): Rectangle;

    /**
     * @brief Performs the transformation of a shape.
     */
    transform(t: Transform): Shape;

    /**
     * @brief Returns the point that has the highest dot product with d.
     * Geometrically, such a point is the farthest in the direction of d.
     */
    support(d: Vec2): Vec2;

    /**
     * @brief Returns an arbitraty point on the boundary of the shape.
     */
    pick(): Vec2;

    /**
     * @brief Draws the boundary of the shape.
     * This method should only be called by objects which have already set the right Transform.
     */
    stroke(ctx: CanvasRenderingContext2D): void;

    /**
     * Draws the interior of the shape.
     * Like stroke(), this method should only be called by objets which have already set the right Transform.
     * @param ctx The context to draw on
     * @param color The color to be used
     */
    fill(ctx: CanvasRenderingContext2D, color: string): void;
}

/**
 * @brief Holds useful data on a collision between two shapes.
 */
export class CollisionData {
    public point: Vec2;

    constructor(p: Vec2) {
        this.point = p;
    }
}

/**
 * @brief Can be used by subclasses to draw their center.
 */
export function drawCross(ctx: CanvasRenderingContext2D, dot: Vec2): void {
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dot.x, dot.y - 5);
    ctx.lineTo(dot.x, dot.y + 5);
    ctx.moveTo(dot.x - 5, dot.y);
    ctx.lineTo(dot.x + 5, dot.y);
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
}

/**
 * @brief Class for axis-aligned bounding boxes.
 * Though Rectangle is conceptually a Shape, 
 * it should not be used by GameObjects directly since it does not support rotation,
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
        return (point.x >= this.position.x && point.x <= this.position.x + this.width)
            && (point.y >= this.position.y && point.y <= this.position.y + this.height);
    }

    /**
     * @brief Returns whether or not this rectangle intersects with rect.
     */
    public intersects(rect: Rectangle): boolean {
        return (this.position.x <= rect.position.x + rect.width  && this.position.x + this.width  >= rect.position.x)
            && (this.position.y <= rect.position.y + rect.height && this.position.y + this.height >= rect.position.y);
    }

    /**
     * @brief Returns true if rect is completely enclosed inside this.
     */
    public encloses(rect: Rectangle): boolean {
        return (this.position.x <= rect.position.x && this.position.x + this.width  >= rect.position.x + rect.width)
            && (this.position.y <= rect.position.y && this.position.y + this.height >= rect.position.y + rect.height);
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
    
    /**
     * @brief Returns an AABB that is slightly larger than this one.
     * The result will have the same center.
     */
    public fatten(factor: number): Rectangle {
        let w = this.width * factor;
        let h = this.height * factor;
        return new Rectangle(
            new Vec2(
                this.position.x + this.width  / 2 - w / 2,
                this.position.y + this.height / 2 - h / 2
            ),
            w, h
        );
    }

    /**
     * @brief Returns the area of this rectangle.
     */
    public area(): number {
        return this.width * this.height;
    }

    /**
     * @brief Computes the area of the minimal AABB enclosing this and rect.
     * The minimal AABB is actually not computed.
     */
    public mergedArea(rect: Rectangle): number {
        let tr = this.position.x + this.width;
		let tb = this.position.y + this.height;
		let rr = rect.position.x + rect.width;
		let rb = rect.position.y + rect.height;
		let l = Math.min(rect.position.x, this.position.x);
		let r = Math.max(rr, tr);
		let t = Math.min(rect.position.y, this.position.y);
		let b = Math.max(rb, tb);
        return (r - l) * (b - t);
    }

    /**
     * @brief Draws the bounding box (for debug purpose).
     * Unlike regular shapes, ctx's transform will be reset:
     * the coordinates are absolute.
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.resetTransform();
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.stroke();
        ctx.closePath();
    }
}

/**************************************************************************************************
 * 
 * Global collision detection algorithm
 * 
 *************************************************************************************************/

/**
 * @brief Returns the collision data between s1 and s2.
 * Returns null if both shapes are not actually intersecting. 
 */
export function intersection(s1: Shape, s2: Shape): CollisionData | null {
    /*if (s1 instanceof ConvexPolygon && s2 instanceof ConvexPolygon) {
        return s1.intersectConvex(s2);
    } else if (s1 instanceof Circle && s2 instanceof Circle) {
        return s1.intersectCircle(s2);
    } else {
        throw new Error("Shapes.ts: intersection(): unsupported shapes type");
    }*/

    /*// https://caseymuratori.com/blog_0003
    let s = Vec2.sub(s1.pick(), s2.pick());
    let simplex = [s];
    let d = Vec2.neg(s);
    while (true) {
        let a = Vec2.sub(s1.support(d), s2.support(Vec2.neg(d)));
        if (a.dot(d) < 0) {
            // The two shapes are not intersecting
            return null;
        }

        // A is not explicity added to the simplex...
        let contains = false;
        if (simplex.length == 1) {
            // ... So this case actually covers lines, and not single points
            // Isn't A past the origin compared to b ?
            // Which would mean we need one less condition
            let ao = Vec2.neg(a);
            let ab = Vec2.sub(simplex[0], a);
            if (ab.dot(ao) > 0) {
                // Closer to some point of the segment of AB that is not A or B
                simplex.push(a);
                d = Vec2.tripleProduct(ab, ao, ab);
            } else {
                // Closer to A
                d = ao;
            }
            // Can not be closer to B (simplex[0])
        } else {
            // https://blog.hamaluik.ca/posts/building-a-collision-engine-part-1-2d-gjk-collision-detection/
            // The video considers 3D vectir, which is not our case
            // So I used the above link to complete this case
            let b = simplex[1];
            let c = simplex[0];
            let ab = Vec2.sub(b, a);
            let ac = Vec2.sub(c, a);
            let ao = Vec2.neg(a);
            let abPerp = Vec2.tripleProduct(ac, ab, ab);
            if (abPerp.dot(ao) > 0) {
                // Outside ab
                simplex = [b, a];
                d = abPerp;
            } else {
                let acPerp = Vec2.tripleProduct(ab, ac, ac);
                if (acPerp.dot(ao) > 0) {
                    // Outside ac
                    simplex = [c, a];
                    d = acPerp;
                } else {
                    // Inside both ab and ac: the simplex contains the origin
                    contains = true;
                }
            }
        }

        if (contains) {
            return new CollisionData(Vec2.Zero);
        }
    }*/

    // https://blog.hamaluik.ca/posts/building-a-collision-engine-part-1-2d-gjk-collision-detection/
    let simplex: Vec2[] = [];
    let d = Vec2.Zero;
    while (true) {
        switch (simplex.length) {
            case 0: {
                d = Vec2.sub(s1.pick(), s2.pick());
                break;
            }

            case 1: {
                d.neg();
                break;
            }

            case 2: {
                let c = simplex[0];
                let cb = Vec2.sub(simplex[1], c);
                let co = Vec2.neg(c);
                d = Vec2.tripleProduct(cb, co, cb);
                break;
            }

            case 3: {
                let a = simplex[2];
                let b = simplex[1];
                let c = simplex[0];
                let ao = Vec2.neg(a);
                let ab = Vec2.sub(b, a);
                let ac = Vec2.sub(c, a);
                let abPerp = Vec2.tripleProduct(ac, ab, ab);
                if (abPerp.dot(ao) > 0) {
                    // Outside ab
                    simplex = [b, a];
                    d = abPerp;
                } else {
                    let acPerp = Vec2.tripleProduct(ab, ac, ac);
                    if (acPerp.dot(ao) > 0) {
                        // Outside ac
                        simplex = [c, a];
                        d = acPerp;
                    } else {
                        // Outside botj ab and ac => simplex encloses (0, 0)
                        return new CollisionData(/*TODO*/Vec2.Zero);
                    }
                }
                break;
            }

            default: {
                throw new Error(`shapes.ts: intersection(): simplex with ${simplex.length} vertices`);
            }
        }

        // Add a new support if possible
        let newVertex = Vec2.sub(s1.support(d), s2.support(Vec2.neg(d)));
        if (d.dot(newVertex) < 0) {
            // The two shapes are not intersecting
            return null
        }
        simplex.push(newVertex);
    }
}