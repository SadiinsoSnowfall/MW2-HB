import { GameObject } from '../gameObject';
import { Collider } from './collider';
import { Vec2 } from '../utils';
import { Shape } from '../physics';

/**
 * ObjectComponent for physics simulation
 */
export class RigidBody extends Collider {
    public static gravity: Vec2 = new Vec2(0, 40);
    public static deltaTime: number = 1 / 60;
    public static deltaTimeSquared: number = Math.pow(RigidBody.deltaTime, 2);

    protected velocity: Vec2;
    protected force: Vec2;
    protected prevPos: Vec2;

    protected angularVelocity: number;
    protected angle: number;
    protected prevAngle: number;

    protected airFriction: number;
    protected mass: number;
    protected bounciness: number; 
    protected roughness: number; // used when calculating friction between two rigidbodies

    protected impulse: Vec2;
    protected static: boolean;

    constructor(object: GameObject, shape: Shape, mass: number, airFriction: number = 0.98, bounciness: number = 0, roughness: number = 1) {
        super(object, shape);
        this.mass = mass;
        this.airFriction = airFriction;
        this.bounciness = bounciness;
        this.roughness = roughness;

        this.prevPos = object.getPosition();
        this.velocity = Vec2.Zero.clone();
        this.force = Vec2.Zero.clone();

        this.angle = 0;
        this.prevAngle = -5;
        this.angularVelocity = 0;
        this.static = false;

        this.impulse = Vec2.Zero.clone();
    }

    public addImpulseXY(x: number, y: number): void {
        this.impulse.x += x;
        this.impulse.y += y;
    }

    public setStatic(state: boolean): void {
        this.static = state;
    }

    public isStatic(): boolean {
        return this.static;
    }

    public applyForce(force: Vec2): void {
        this.force.add(force);
    }

    public applyImpulse(): void {
        if (!this.impulse.isNull()) {
            const tmp = this.object.getPosition();
            this.object.move(this.impulse.x, this.impulse.y);
            this.prevPos = tmp;
            this.impulse.setXY(0, 0);
        }
    }

    public update(): boolean {
        if (this.static) {
            return false;
        }

        this.applyImpulse();

        // add gravity
        this.applyForce(Vec2.mul(RigidBody.gravity, this.mass));

        // check for collisions

        const curPos = this.object.getPosition();

        // update velocity
        const acceleration = Vec2.div(this.force, this.mass).mul(RigidBody.deltaTimeSquared);
        this.velocity = Vec2.sub(curPos, this.prevPos).mul(this.airFriction).add(acceleration);
        this.prevPos = curPos;

        // update angular velocity
        this.angularVelocity = (this.angle - this.prevAngle) * this.airFriction;
        this.prevAngle = this.angle;
        this.angle += this.angularVelocity;

        // update position & rotation
        this.object.move(this.velocity.x, this.velocity.y);
        if (this.angularVelocity !== 0) {
            this.object.rotateDegrees(this.angularVelocity);
        }

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