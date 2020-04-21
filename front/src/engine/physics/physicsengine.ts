import { AABBTree } from "../physics/aabbTree";
import { RigidBody } from "../components/rigidBody";


export class PhysicsEngine {
    private tree: AABBTree;

    constructor(tree: AABBTree) {
        this.tree = tree;
    }

    public update() {
        const collisions = this.tree.queryAll();

        for (let i = 0; i < collisions.length; ++i) {
            const c = collisions[i];
            const oa = c.getObjectA();
            const ob = c.getObjectB();

            const oa_static = oa.getCollider() instanceof RigidBody ? (oa.getCollider() as RigidBody).isStatic() : true;
            const ob_static = ob.getCollider() instanceof RigidBody ? (ob.getCollider() as RigidBody).isStatic() : true;

            // if both colliders are static, skip the collision processing
            if (oa_static && ob_static) {
                continue;
            }

            /**
             * update position of each object
             */

            const depth = c.getPenetrationDepth();
            const impulseForce = depth * (oa_static || ob_static ? 2 : 1);
            const impulse = c.getNormal().mul(impulseForce);

            if (!oa_static) {
                const points = c.getContactsOnA();
                const rb = oa.getCollider() as RigidBody;
                rb.addImpulseXY(impulse.x, impulse.y);
            }

            if (!ob_static) {
                const points = c.getContactsOnB();
                const rb = ob.getCollider() as RigidBody;
                rb.addImpulseXY(-impulse.x, -impulse.y);
            }
        }
    }

}