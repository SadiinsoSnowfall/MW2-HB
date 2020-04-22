import { GameObject } from "../gameObject";

export abstract class ObjectComponent {
    readonly object: GameObject;

    constructor(object: GameObject) {
        this.object = object;
    }

    /**
     * Shortcut to retrieve the current frame number
     * as it may be used a lot by object components
     */
    protected tick(): number {
        return this.object.getScene().tick();
    }

    /**
     * Updates the component.
     */
    public abstract update(): void;
    
}