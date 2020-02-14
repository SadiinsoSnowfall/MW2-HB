import { Transform } from './utils';
import { RigidBody, Display, Collider } from './components';

export class GameObject {
    transform: Transform;

    displayComponent: Display | null;
    rididBody: RigidBody | null;
    collider: Collider | null;

    constructor(transform: Transform = Transform.Neutral) {
        this.transform = transform;
        this.displayComponent = this.rididBody = this.collider = null;
    }

    public tick(): void {
        
    }

}