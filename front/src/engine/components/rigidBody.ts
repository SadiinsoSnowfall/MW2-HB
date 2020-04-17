import { GameObject } from '../gameObject';
import { Collider } from './collider';
import { Vec2 } from '../utils';
import { Shape, intersection } from '../physics';
import { Scene } from '../scene';

/**
 * ObjectComponent for physics simulation
 */
export class RigidBody extends Collider {
    public static gravity: Vec2 = new Vec2(0, 40);
    public static deltaTime: number = 1 / 60;
    public static deltaTimeSquared: number = Math.pow(RigidBody.deltaTime, 2);

    protected velocity: Vec2;
    protected force: Vec2;
    protected angularVelocity: number;
    protected prevPos: Vec2;

    protected airFriction: number;
    protected mass: number;
    protected bounciness: number; 
    protected roughness: number; // used when calculating friction between two rigidbodies

    constructor(object: GameObject, shape: Shape, mass: number, airFriction: number = 0.98, bounciness: number = 0, roughness: number = 1) {
        super(object, shape);
        this.mass = mass;
        this.airFriction = airFriction;
        this.bounciness = bounciness;
        this.roughness = roughness;

        this.prevPos = object.getPosition();
        this.velocity = new Vec2(0, 0);
        this.force = new Vec2(0, 0);
        this.angularVelocity = 0;
    }

    public applyForce(force: Vec2): void {
        this.force.add(force);
    }

    public update(): boolean {
        const scene = this.object.getScene();
        let collisions = scene.getTree().query(this);
        if (collisions.length > 0) {
            this.force.mul(-1.01);
            this.prevPos = this.object.getPosition();
        }

        // add gravity
        this.applyForce(Vec2.mul(RigidBody.gravity, this.mass));

        const curPos = this.object.getPosition();

        const acceleration = Vec2.div(this.force, this.mass).mul(RigidBody.deltaTimeSquared);
        this.velocity = Vec2.sub(curPos, this.prevPos).mul(this.airFriction).add(acceleration);

        this.prevPos = curPos;

        this.object.translate(this.velocity.x, this.velocity.y);
        return true;
    }

    public getMass(): number {
        return this.mass;
    }

    public setMass(weight: number) {
        this.mass = weight;
    }

    public getMomentum(): Vec2 {
        return this.velocity;
    }

    public setMomentum(momentum: Vec2) {
        this.velocity = momentum;
    }

}