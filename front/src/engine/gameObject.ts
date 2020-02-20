import { Transform, Vec2 } from './utils';
import { RigidBody, Display, Collider, Behaviour } from './components';
import { Scene } from './scene';

export class GameObject {
    transform: Transform;

    private display?: Display;
    private rigidBody?: RigidBody;
    private collider?: Collider;
    private behaviour?: Behaviour;

    private _scene?: Scene;

    /**
     * @brief Creates a new GameObject.
     * @param x Horizontal center of the object
     * @param y Vertical center
     */
    constructor(x: number, y: number) {
        this.transform = Transform.Identity.center(x, y);
    }

    /**********************************************************************************************
     * 
     * Methods related to components
     * 
     *********************************************************************************************/

    public scene(): Scene | undefined {
        return this._scene;
    }

    public setScene(scene?: Scene): void {
        this._scene = scene;
    }

    public displayComponent(): Display | undefined {
        return this.display;
    }

    public setDisplayComponent(display?: Display): void {
        this.display = display;
    }

    public rigidBodyComponent(): RigidBody | undefined {
        return this.rigidBody;
    }
    
    public setRigidBodyComponent(body?: RigidBody): void {
        this.rigidBody = body;
    }

    public colliderComponent(): Collider | undefined {
        return this.collider;
    }

    public setColliderComponent(collider?: Collider): void {
        this.collider = collider;
    }

    public behaviourComponent(): Behaviour | undefined {
        return this.behaviour;
    }

    public setBehaviourComponent(behaviour?: Behaviour): void {
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
     * Methods related to transform
     * 
     *********************************************************************************************/

    public getTransform(): Transform {
        return this.transform;
    }

    public getPosition(): Vec2 {
        return this.transform.getTranslation();
    }

    public getScale(): Vec2 {
        return this.transform.getScale();
    }

    public getRotation(): number {
        return this.transform.getRotation();
    }

    /** 
     * @brief Cancels all scales and rotations on the object, only preserving its position.
     */
    public resetTransform(): void {
        let v = this.transform.getTranslation();
        this.transform = Transform.Identity.center(v.x, v.y);
    }

    /**
     * @brief Moves the object without regards for its current rotation and scale.
     * @see translate
     */
    public move(x: number, y: number): void {
        this.transform = this.transform.move(x, y);
    }

    /**
     * @brief Moves the object relative to its current transform.
     * If an object is perpetually rotating on itself, translating it with a vector of (1, 1)
     * will make it run in circle, while with move, it would move straight.
     */
    public translate(x: number, y: number): void {
        this.transform = this.transform.translate(x, y);
    }

    /**
     * @brief Scales the object.
     * 1. is the neutral value for both parameters.
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

    public shear(x: number, y: number): void {
        this.transform = this.transform.shear(x, y);
    }
}