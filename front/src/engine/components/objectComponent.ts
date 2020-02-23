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
        return this.object?.scene()?.tick() || -1;
    }

    /**
     * Updates the component.
     * Returns true if the object has physically moved
     * (typically, Display components will always return false,
     * whereas a Behaviour might return true if it made the object move).
     */
    public abstract update(): boolean;
    
}