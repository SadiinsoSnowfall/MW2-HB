import { Vec2, Transform } from "../utils";
import { assert } from "../../utils";

/**************************************************************************************************
 * 
 * General data structures (and helper functions)
 * 
 *************************************************************************************************/

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

function drawCross(ctx: CanvasRenderingContext2D, dot: Vec2): void {
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


/**************************************************************************************************
 * 
 * Specialized shapes
 * 
 *************************************************************************************************/

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