import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";

/**
 * ObjectComponent for scripting objects
 */
export abstract class Behaviour extends ObjectComponent {
    
    constructor(object: GameObject) {
        super(object);
    }

    public update(delta: number): boolean {
        return false;
    }

}