import { Transform } from './utils';
import { RigidBody, Display, Collider, Behaviour } from './components';

export class GameObject {
    transform: Transform;

    display: Display | null;
    rididBody: RigidBody | null;
    collider: Collider | null;
    behaviour: Behaviour | null;

    constructor(transform: Transform = Transform.Neutral) {
        this.transform = transform;
        this.display = this.rididBody = this.collider = this.behaviour = null;
    }

    public displayComponent(): Display | null {
        return this.display;
    }

    public ribidBodyComponent(): RigidBody | null {
        return this.rididBody;
    }

    public colliderComponent(): Collider | null {
        return this.collider;
    }

    public behaviourComponent(): Behaviour | null {
        return this.behaviour;
    }

    public update(): void {
        this.behaviour?.update();
        this.rididBody?.update();
        this.collider?.update();
        this.display?.update();
    }

}