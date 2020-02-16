import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";

/**
 * ObjectComponent for scripting objects
 */
export class Behaviour extends ObjectComponent {
    
    constructor(object: GameObject) {
        super(object);
    }

    public update(): void {

    }

}