import { GameObject } from '../gameObject';
import { ObjectComponent } from './';
import { Vec2 } from '../utils';

/**
 * ObjectComponent for physics simulation
 */
export class RigidBody extends ObjectComponent {
    private momentum: Vec2;
    private mass: number;
    private bounciness: number; 
    private roughness: number; // used when calculating friction between two rigidbodies

    private static gravityPerTick = 0.03;

    constructor(object: GameObject, mass: number, bounciness: number = 0, roughness: number = 1) {
        super(object);
        this.momentum = new Vec2(0, 0);
        this.mass = mass;
        this.bounciness = bounciness;
        this.roughness = roughness;
    }

    public update(): boolean {
        this.momentum.y += this.mass * RigidBody.gravityPerTick; // add gravity

        this.object.translate(this.momentum.x, this.momentum.y);
        return true;
    }

    public getMass(): number {
        return this.mass;
    }

    public setMass(weight: number) {
        this.mass = weight;
    }

    public getMomentum(): Vec2 {
        return this.momentum;
    }

    public setMomentum(momentum: Vec2) {
        this.momentum = momentum;
    }

}