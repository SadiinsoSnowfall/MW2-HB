import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";
import { Rectangle, Shape } from '../shapes';

/**
 * ObjectComponent for basic hitbox management
 */
export class Collider extends ObjectComponent {
    protected shape: Shape;

    /**
     * @brief Constructor for colliders.
     * @param object 
     * @param shape 
     */
    constructor(object: GameObject, shape: Shape) {
        super(object);
        this.shape = shape;
    }

    public update(): boolean {
        return false;
    }

    /**
     * @brief Returns the hitbox of this collider.
     * The hitbox is given relative to this object's transform,
     * so it is not scaled nor rotated.
     */
    public getShape(): Shape {
        return this.shape;
    }
}