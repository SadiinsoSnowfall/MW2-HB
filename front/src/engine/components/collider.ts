import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";

/**
 * ObjectComponent for basic hitbox management
 */
export class Collider extends ObjectComponent {

    constructor(object: GameObject) {
        super(object);
    }

    public update(): void {

    }

}