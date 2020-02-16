import { Transform, Vec2 } from './utils';
import { RigidBody, Display, Collider, Behaviour } from './components';

export class GameObject {
    transform: Transform;

    display: Display | null;
    rigidBody: RigidBody | null;
    collider: Collider | null;
    behaviour: Behaviour | null;

    /**
     * @brief Creates a new GameObject.
     * @param x Horizontal center of the object
     * @param y Vertical center
     */
    constructor(x: number, y: number) {
        this.transform = Transform.Identity.center(x, y);
        this.display = this.rigidBody = this.collider = this.behaviour = null;
    }

    /**********************************************************************************************
     * 
     * Methods related to components
     * 
     *********************************************************************************************/

    public displayComponent(): Display | null {
        return this.display;
    }

    public setDisplayComponent(display: Display | null): void {
        this.display = display;
    }

    public rigidBodyComponent(): RigidBody | null {
        return this.rigidBody;
    }
    
    public setRigidBodyComponent(body: RigidBody | null): void {
        this.rigidBody = body;
    }

    public colliderComponent(): Collider | null {
        return this.collider;
    }

    public setColliderComponent(collider: Collider | null): void {
        this.collider = collider;
    }

    public behaviourComponent(): Behaviour | null {
        return this.behaviour;
    }

    public setBehaviourComponent(behaviour: Behaviour | null): void {
        this.behaviour = behaviour;
    }

    public update(): void {
        this.behaviour?.update();
        this.rigidBody?.update();
        this.collider?.update();
        this.display?.update();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // save and restore are only necessary if sub-objects are handled
        // otherwise they're just a waste a time, provided we use setTransform instead of transform 
        // in Transform.applyToContext
        ctx.save();
        this.transform.applyToContext(ctx);
        this.display?.draw(ctx);
        ctx.restore();
    }

    /**********************************************************************************************
     * 
     * Methods related to the Transform
     * 
     *********************************************************************************************/

     public getPosition(): Vec2 {
         return this.transform.getTranslation();
     }

    /** 
     * @brief Cancels all scales and rotations on the object, only preserving its position.
     */
    public resetTransform(): void {
        let v = this.transform.getTranslation();
        this.transform = Transform.Identity.center(v.x, v.y);
    }

    /**
     * @brief Scales the object.
     * @param x Horizontal scale 
     * @param y Vertical scale
     * 1. is the neutral value.
     * @todo Determine if putting negative values flips the object
     */
    public scale(x: number, y: number): void {
        this.transform = this.transform.scale(x, y);
    }

    public rotateRadians(angle: number): void {
        this.transform = this.transform.rotateRadians(angle);
    }

    public rotateDegrees(angle: number): void {
        this.transform = this.transform.rotateDegrees(angle);
    }

}