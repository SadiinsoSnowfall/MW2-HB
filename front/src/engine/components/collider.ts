import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";
import { Shape } from '../physics';

/**
 * ObjectComponent for basic hitbox management
 */
export class Collider extends ObjectComponent {
    protected shape: Shape;
    protected static: boolean;

    /**
     * @brief Constructor for colliders.
     * @param object 
     * @param shape 
     */
    constructor(object: GameObject, shape: Shape) {
        super(object);
        this.shape = shape;
        this.static = false;
    }

    public setStatic(state: boolean): void {
        this.static = state;
    }

    public isStatic(): boolean {
        return this.static;
    }

    public update(): void {}

    /**
     * @brief Returns the hitbox of this collider.
     * The hitbox is given relative to this object's transform,
     * so it is not scaled nor rotated.
     */
    public getShape(): Shape {
        return this.shape;
    }
}