import { AABBTree } from "../physics/aabbTree";
import { RigidBody } from "../components/rigidBody";
import { Vec2 } from "../utils";
import { GameObject } from "../gameObject";
import { Collider } from "../components";


export class PhysicsEngine {
    private tree: AABBTree;

    public static deltaTime: number = 1 / 60;
    public static deltaTimeSquared: number = Math.pow(RigidBody.deltaTime, 2);

    // set of the colliding objects from last frame
    public lastCollide: Set<GameObject> = new Set();

    constructor(tree: AABBTree) {
        this.tree = tree;
    }

    public setTree(tree: AABBTree) {
        this.tree = tree;
    }

    public update() {
        const collisions = this.tree.queryAll();
        if (collisions.length == 0) {
            return;
        }

        const newColliders = new Set<GameObject>();

        // count contacts points
        for (let i = 0; i < collisions.length; ++i) {
            const c = collisions[i];
            const count = Math.max(c.getContactsOnB().length, 1);
            const ca = c.getObjectA().getCollider();
            const cb = c.getObjectB().getCollider();

            // add IDs to list
            newColliders.add(c.getObjectA()).add(c.getObjectB());

            if (ca instanceof RigidBody) {
                const ra = ca as RigidBody
                ra.contacts += count
                ra.clearForce();
            }

            if (cb instanceof RigidBody) {
                const rb = cb as RigidBody;
                rb.contacts += count
                rb.clearForce();
            }
        }

        // perform update
        for (let i = 0; i < collisions.length; ++i) {
            const c = collisions[i];
            const oa = c.getObjectA().id < c.getObjectB().id ? c.getObjectA() : c.getObjectB();
            const ob = c.getObjectA().id < c.getObjectB().id ? c.getObjectB() : c.getObjectA();

            const oac = oa.getCollider() as Collider;
            const obc = ob.getCollider() as Collider;

            const oa_static = oac.isStatic()
            const ob_static = obc.isStatic();

            // if both colliders are static, skip the collision processing
            if (oa_static && ob_static) {
                continue;
            }

            /**
             * update position of each object
             */

            const depth = c.getPenetrationDepth();
            const normal = c.getNormal();

            const ndepth = depth * normal.sum();
            const impulseForce = ndepth * (oa_static || ob_static ? 2 : 1);
            const impulse = c.getNormal().mul(impulseForce);

            if (!oa_static) {
                const rb = oa.getCollider() as RigidBody;
                const ci = 0.9 / rb.contacts;
                rb.addImpulseXY(impulse.x * ci, impulse.y * ci);
            }

            if (!ob_static) {
                const rb = ob.getCollider() as RigidBody;
                const ci = 0.9 / rb.contacts;
                rb.addImpulseXY(-impulse.x * ci, -impulse.y * ci);
            }
        }

        // apply position impulse & reset contacts
        for (const collider of this.tree) {
            if (collider instanceof RigidBody) {
                const rb = collider as RigidBody
                rb.applyImpulse();
                rb.contacts = 0;
            }
        }

        // compute velocity change
        for (let i = 0; i < collisions.length; ++i) {
            const c = collisions[i];


        }
        
        // notify new colliders
        for (const obj of newColliders) {
            if (!this.lastCollide.has(obj)) {
                obj.getBehaviour()?.onCollide();
            }
        }

        // store current colliders IDs
        this.lastCollide = newColliders;
    }

}