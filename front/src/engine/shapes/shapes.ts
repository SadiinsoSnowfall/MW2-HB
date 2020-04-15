import { Vec2, Transform } from "../utils";
import { Rectangle } from './rectangle';

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
    public readonly contact: Vec2;
    public readonly depth: number;
    public readonly normal: Vec2;

    constructor(contact: Vec2, depth: number, normal: Vec2) {
        this.contact = contact;
        this.depth = depth;
        this.normal = normal;
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

// Support function of the Minkowski difference of s1 and s2
function support(s1: Shape, s2: Shape, d: Vec2): Vec2 {
    return Vec2.sub(s1.support(d), s2.support(Vec2.neg(d))); // s1.support(d) - s2.support(-d)
}

// Implementation of GJK
// https://blog.hamaluik.ca/posts/building-a-collision-engine-part-1-2d-gjk-collision-detection/
// Returns a triangle containing the origin if there is a collision, an empty list otherwise
function gjk(s1: Shape, s2: Shape): Vec2[] {
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
                        // Outside both ab and ac => simplex encloses (0, 0)
                        return simplex;
                    }
                }
                break;
            }

            default: {
                throw new Error(`shapes.ts: intersection(): simplex with ${simplex.length} vertices`);
            }
        }

        // Add a new support if possible
        let newVertex = support(s1, s2, d);
        if (d.dot(newVertex) < 0) {
            // The two shapes are not intersecting
            return [];
        }
        simplex.push(newVertex);
    }
}

const epaTolerance = 0.00001;

// Auxiliary class for EPA
class Edge {
    public distance: number;
    public index: number;
    public normal: Vec2;

    constructor() {
        this.index = 0;
        this.normal = Vec2.Zero;
        this.distance = Number.MAX_VALUE;
    }
}

// Auxiliary function for EPA
function findClosestEdge(simplex: Vec2[]): Edge {
    let r = new Edge();
    for (let i = 0; i < simplex.length; i++) {
        let j = (i + 1 == simplex.length)? 0 : i + 1;
        let a = simplex[i];
        let b = simplex[j];
        let ab = Vec2.sub(b, a);
        let n = Vec2.normalVector(ab);
        n.normalize();
        let d = n.dot(a);
        if (d < r.distance) {
            r.distance = d;
            r.normal = n;
            r.index = j;
        }
    }
    return r;
}

// Implementation of EPA
// http://www.dyn4j.org/2010/05/epa-expanding-polytope-algorithm/
// Computes the penetration depth and contact point
function epa(s1: Shape, s2: Shape, simplex: Vec2[]): CollisionData {
    while (true) {
        let e = findClosestEdge(simplex);
        let p = support(s1, s2, e.normal);
        let dot = p.dot(e.normal);
        if (dot - e.distance < epaTolerance) {
            return new CollisionData(Vec2.Zero, dot, e.normal);
        } else {
            simplex.splice(e.index, 0, p);
        }
    }
}

/**
 * @brief Returns the collision data between s1 and s2.
 * Returns null if both shapes are not actually intersecting. 
 */
export function intersection(s1: Shape, s2: Shape): CollisionData | null {
    let simplex = gjk(s1, s2);
    if (simplex.length == 0) {
        return null;
    } else {
        return epa(s1, s2, simplex);
    }
}