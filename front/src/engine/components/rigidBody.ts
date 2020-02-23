import { GameObject } from '../gameObject';
import { ObjectComponent } from './';

/**
 * ObjectComponent for physics simulation
 */
export class RigidBody extends ObjectComponent {

    constructor(object: GameObject) {
        super(object);
    }

    public update(): boolean {
        return false;
    }

}