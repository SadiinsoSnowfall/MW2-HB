import { Vec2, Transform } from "../utils";
import { Shape, Edge, drawCross } from './shape';
import { Rectangle } from './rectangle';
import { assert } from '../../utils';

/*
 * Returns the convex hull of a set of points.
 * set should not contain twice the same vale ideally
 * (though the algorithm would still return the correct value)
 */
function quickHull(set: Vec2[]): ConvexPolygon {
    // https://en.wikipedia.org/wiki/Quickhull

    // Left and right most points
    let it = set.values();
    let itr = it.next();
    let left = itr.value;
    let right = left;
    itr = it.next();
    while (!itr.done) {
        const p = itr.value;
        if (p.x < left.x) {
            left = p;
        } else if (p.x > right.x) {
            right = p;
        }
        itr = it.next();
    }
    
    // Partition in two subsets
    let n = Vec2.normalEdge(left, right);
    let above: Vec2[] = [];
    let below: Vec2[] = [];
    for (const p of set) {
        if (Vec2.sub(p, left).dot(n) > 0) {
            above.push(p);
        } else {
            below.push(p);
        }
    }

    let vertices = [left, right];

    function selectRight(set: Vec2[], A: Vec2, B: Vec2): Vec2[] {
        let r: Vec2[] = [];
        let n = Vec2.normalEdge(A, B);
        for (const p of set) {
            if (Vec2.sub(p, A).dot(n) > 0) {
                r.push(p);
            }
        }
        return r;
    }

    // Pi: index of P
    function findHull(set: Vec2[], P: Vec2, Q: Vec2, Pi: number): void {
        if (set.length == 0) {
            return;
        }
        
        // Find the farthest point from PQ
        let normal = Vec2.normalEdge(P, Q);
        let it = set.values();
        let itr = it.next();
        let C = itr.value;
        let max = C.dot(normal);
        itr = it.next();
        while (!itr.done) {
            const p = itr.value;
            let dot = p.dot(normal);
            if (dot > max) {
                max = dot;
                C = p;
            }
            itr = it.next();
        }

        // Add C to the convex hull
        vertices.splice(Pi + 1, 0, C);

        // Compute the remaining sets
        let s1 = selectRight(set, P, C);
        let s2 = selectRight(set, C, Q);

        findHull(s1, P, C, Pi);
        findHull(s2, C, Q, vertices.indexOf(C));
    }

    findHull(above, left, right, 0);
    findHull(below, right, left, vertices.length - 1);
    return new ConvexPolygon(Vec2.Zero, vertices);
}

/**
 * @brief Class specialized in convex polygons.
 */
export class ConvexPolygon implements Shape {
    private readonly center: Vec2;
    private vertices: Vec2[];

    /**
     * @brief Given a center and a list of vertices given counterclockwise, constructs a polygon.
     * @param center Center of the polygon
     * @param vertices Vertices of the polygon, given relative to center 
     * This constructor assumes that center is indeed the center of the polygon and that the points
     * are given in the right order. If these conditions are not respected, no error will be thrown
     * but the behaviour of this class' methods are unspecified.
     */
    constructor(center: Vec2, vertices: Vec2[]) {
        assert(vertices.length >= 3, "ConvexPolygon#constructor: cannot make a polygone out of less than 3 vertices");
        this.center = center;
        this.vertices = vertices;
    }

    /**
     * @brief Debug only; used only by PolygonDisplay for debug purpose.
     * Should not be used.
     */
    public getVertices(): Vec2[] {
        return this.vertices;
    }

    /**
     * @brief Returns whether or not point belongs in this shape.
     */
    public pointIn(point: Vec2): boolean {
        let a = Vec2.add(this.vertices[this.vertices.length - 1], this.center);
        for (const bc of this.vertices) {
            const b = Vec2.add(bc, this.center);
            const n = Vec2.normalEdge(a, b);
            if (Vec2.sub(point, a).dot(n) > 0) {
                return false;
            }
            a = b;
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

        return new Rectangle(new Vec2(this.center.x + xmin, this.center.y + ymin), xmax - xmin, ymax - ymin);
    }

    public transform(t: Transform): ConvexPolygon {
        let t2 = t.place(0, 0);
        let r: Vec2[] = [];
        for (const p of this.vertices) {
            r.push(t2.multiplyVector(p));
        }
        return new ConvexPolygon(t.multiplyVector(this.center), r);
    }

    public support(d: Vec2): Vec2 {
        let max = Vec2.add(this.vertices[0], this.center);
        let dot = max.dot(d);
        for (let i = 1; i < this.vertices.length; i++) {
            const p = Vec2.add(this.vertices[i], this.center);
            let tmp = p.dot(d);
            if (tmp > dot) {
                max = p;
                dot = tmp;
            }
        }
        return max;
    }

    public feature(d: Vec2): Edge {
        let index = 0;
        let max = Vec2.add(this.vertices[index], this.center);
        let dot = max.dot(d);
        for (let i = 1; i < this.vertices.length; i++) {
            const p = Vec2.add(this.vertices[i], this.center);
            let tmp = p.dot(d);
            if (tmp > dot) {
                max = p;
                index = i;
                dot = tmp;
            }
        }

        let previous = this.vertices[(index == 0)? this.vertices.length - 1 : index - 1];
        let next = this.vertices[(index == this.vertices.length - 1)? 0 : index + 1];
        
        let l = Vec2.sub(max, next).normalize();
        let r = Vec2.sub(max, previous).normalize();
        if (r.dot(d) <= l.dot(d)) {
            return new Edge(max, previous, max);
        } else {
            return new Edge(max, max, next);
        }
    }

    public pick(): Vec2 {
        return Vec2.add(this.center, this.vertices[0]);
    }

    /**
     * @brief Returns null if this and other are not colliding.
     * Otherwise, returns the penetration vector.
     */
    public collides(other: ConvexPolygon): Vec2 | null {
        return null;
    }

    public stroke(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        let last = this.vertices[this.vertices.length - 1];
        ctx.moveTo(last.x + this.center.x, last.y + this.center.y);
        for (const p of this.vertices) {
            ctx.lineTo(p.x + this.center.x, p.y + this.center.y);
        }
        ctx.stroke();
        ctx.closePath();
        drawCross(ctx, this.center);
    }

    public fill(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        let last = this.vertices[this.vertices.length - 1]
        ctx.moveTo(last.x + this.center.x, last.y + this.center.y);
        for (const p of this.vertices) {
            ctx.lineTo(p.x + this.center.x, p.y + this.center.y);
        }
        ctx.closePath();
        ctx.fill();
    }

    /*
    // Unused
    private minkowskiDifference(o: ConvexPolygon): ConvexPolygon {
        let vertices: Vec2[] = [];
        for (const tp of this.vertices) {
            for (const op of o.vertices) {
                let sub = Vec2.sub(tp, op);
                vertices.push(sub);
            }
        }
        return quickHull(vertices);
    }

    // Unused
    private intersectConvex(o: ConvexPolygon): CollisionData | null {
        let minkowski = this.minkowskiDifference(o);
        // Since the minimum distance between minkowski and (0, 0) is the distance between the two polygons,
        // we could change the condition to consider close enough polygons to be intersecting.
        if (minkowski.pointIn(Vec2.Zero)) {
            // The two polygons intersect
            let inter = new Vec2(0, 0); //TODO give intersection point
            return new CollisionData(inter);
        } else {
            // No intersection
            return null;
        }
    }
    */
}