import { GameObject } from "../gameObject";

export abstract class ObjectComponent {
    readonly object: GameObject;

    constructor(object: GameObject) {
        this.object = object;
    }

    public abstract update(): void;
    
}