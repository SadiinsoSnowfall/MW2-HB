import { GameObject } from "../gameObject";

export class ObjectComponent {
    readonly object: GameObject;

    constructor(object: GameObject) {
        this.object = object;
    }

    public update(): void {
        
    }

}