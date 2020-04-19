import { GameObject } from "../gameObject";
import { Vec2 } from "../utils";
import { Collider } from "../components";
import { Shape, Edge, drawCross } from ".";

export class Collision {
    /**
     * @brief One of the objects involved in the collision.
     */
    private objectA: GameObject;

    /**
     * @brief The other object involved in the collision.
     */
    private objectB: GameObject;

    /**
     * @brief The points of contact on objectA, expressed in its coordinate system.
     */
    private contactsA: Vec2[];

    /**
     * @brief The points of contact on objectB, expressed in its coordinate system.
     */
    private contactsB: Vec2[];

    /**
     * @brief The normal of the collision, from A to B.
     */
    private normal: Vec2;

    /**
     * @brief Magnitude of the smallest translation vector to separate A and B
     */
    private penetration: number;

    /**
     * @brief Constructor.
     * This constructor is designed to be used in this file. 
     * That is why the requirements on the parameters might seem odd.
     * A - B refers to the minkowski difference of the two involved shapes.
     * @param colliderA One of the two objects' collider
     * @param colliderB The other collider
     * @param contactA The point of contact on A, expressed in A-B's system
     * @param contactB The point of contact on B, expressed in A-B's system
     * @param normal Normal to the collision from A to B.
     * @param penetration Penetration depth
     */
    constructor(colliderA: Collider, colliderB: Collider, contacts: Vec2[], normal: Vec2, penetration: number) {
        this.objectA = colliderA.object;
        this.objectB = colliderB.object;
        // No way this works
        // There are systems: world, A, B, and A-B
        // The points are given in A-B, and revert translates from either A or B to world
        // So it can't work this way
        this.contactsA = this.objectA.getTransform().revertMultiple(contacts);
        this.contactsB = this.objectB.getTransform().revertMultiple(contacts);
        this.normal = normal;
        this.penetration = penetration;
    }

    public getObjectA() {
        return this.objectA;
    }

    public getObjectB() {
        return this.objectB;
    }

    public getContactsOnA() {
        return this.contactsA;
    }

    public getContactsOnB() {
        return this.contactsB;
    }

    /**
     * @brief Returns the contact point on obj.
     * @param obj Assumed to be either objectA or objectB.
     */
    public getContacts(obj: GameObject): Vec2[] {
        return (obj == this.objectA)? this.contactsA : this.contactsB;
    }

    public getNormal() {
        return this.normal;
    }

    public getPenetrationDepth() {
        return this.penetration;
    }

    /**
     * @brief Separates the two object using penetration.
     * To be called only once.
     */
    public separate(): void {
        this.objectA.move(this.normal.x * this.penetration, this.normal.y * this.penetration);
    }

    /**
     * @brief Draws all contact points on screen, for debugging purpose.
     */
    public draw(ctx: CanvasRenderingContext2D): void {
        for (let p of this.contactsA) {
            drawCross(ctx, p, "#FFFFFF");
        }

        for (let p of this.contactsB) {
            drawCross(ctx, p, "#000000");
        }
        // Only black crosses should be seen
    }
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
class EPAEdge {
    public distance: number;
    public index: number;
    public normal: Vec2;

    constructor() {
        this.index = 0;
        this.normal = Vec2.Zero;
        this.distance = Number.MAX_VALUE;
    }
}

// Auxiliary function for EPA that finds the closest edge to the origin
function findClosestEdge(simplex: Vec2[]): EPAEdge {
    let r = new EPAEdge();
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
// Computes the penetration vector and contact points
// Returns []
function epa(a: Collider, shapeA: Shape, b: Collider, shapeB: Shape, simplex: Vec2[]): [Vec2, number] {
    while (true) {
        let e = findClosestEdge(simplex);
        let p = support(shapeA, shapeB, e.normal);
        let dot = p.dot(e.normal);
        if (dot - e.distance < epaTolerance) {
            return [e.normal, dot]; // Is it really dot? It's not an actual distance, it doesn't make sense
        } else {
            simplex.splice(e.index, 0, p);
        }
    }
}

function clip(a: Vec2, b: Vec2, normal: Vec2, o: number): Vec2[] {
    let cp: Vec2[] = [];
    let d1 = normal.dot(a) - o;
    let d2 = normal.dot(b) - o;

    // If either point is past o along n, we can keep it
    if (d1 >= 0) {
        cp.push(a);
    }
    if (d2 >= 0) {
        cp.push(b);
    }

    // Are they on opposing sides?
    if (d1 * d2 < 0) {
        // The vector for the edge being clipped
        let e = Vec2.sub(b, a);
        e.mul(d1 / (d1 - d2));
        e.add(a);
        cp.push(e);
    }

    return cp;
}

// Computes a set of contact points and create the Collision object.
// http://www.dyn4j.org/2011/11/contact-points-using-clipping/
function contactPoints(a: Collider, b: Collider, normal: Vec2, penetration: number): Collision {
    a.getShape();
    let e1 = a.getShape().feature(normal); // Must be transformed!
    let e2 = b.getShape().feature(Vec2.neg(normal));

    // Handles curved shapes
    if (e1 instanceof Vec2 || e2 instanceof Vec2) {
        let r: Vec2[] = [];
        if (e1 instanceof Vec2) { r.push(e1); }
        if (e2 instanceof Vec2) { r.push(e2); }
        return new Collision(a, b, r, normal, penetration);
    }

    let flip = Math.abs(e1.getVector().dot(normal)) > Math.abs(e2.getVector().dot(normal));
    let ref: Edge;
    let inc: Edge;
    if (flip) {
        ref = e2;
        inc = e1;
    } else {
        ref = e1;
        inc = e2;
    }

    let refv = ref.getVector();
    refv.normalize();

    let o1 = refv.dot(ref.getA());
    let cp: Vec2[] = clip(inc.getA(), inc.getB(), refv, o1);
    if (cp.length < 2) {
        // Not sure if that is what needs to be done here
        console.log("fail #1");
        return new Collision(a, b, cp, normal, penetration);
    }

    let o2 = refv.dot(ref.getB());
    cp = clip(cp[0], cp[1], Vec2.neg(refv), -o2);
    if (cp.length < 2) {
        console.log("fail #2");
        return new Collision(a, b, cp, normal, penetration);
    }

    let refNormal = Vec2.normalVector(refv); // Originally ref, so it may not be refv
    // Actually not even sure it's the right function
    if (flip) {
        refNormal.neg();
    }

    let max = refNormal.dot(ref.getMaxVertex());
    if (refNormal.dot(cp[0]) - max < 0) {
        cp.shift(); // Removing the first point
    } else {
        cp.splice(1, 1); // Removing the second point
    }

    return new Collision(a, b, cp, normal, penetration);
}

/**
 * @brief Returns the collision data between a and b.
 * Returns null if both shapes are not actually intersecting. 
 * This signature is only temporary. a and b should be the remaining arguments.
 */
export function intersection(a: Collider, shapeA: Shape, b: Collider, shapeB: Shape): Collision | null {
    let simplex = gjk(shapeA, shapeB);
    if (simplex.length == 0) {
        return null;
    } else {
        // Dealing with length == 1 or 2 : http://www.dtecta.com/papers/gdc2001depth.pdf (page 15)
        let np = epa(a, shapeA, b, shapeB, simplex);
        return contactPoints(a, b, np[0], np[1]);
    }
}