import { Transform, Vec2 } from './utils';
import { Display, Collider, Behaviour } from './components';
import { Scene } from './scene';

export class GameObject {
    private static currentId: number = 0;

    public readonly id: number;
    private enabled: boolean;
    private moved: boolean;

    private transform: Transform;

    private display?: Display;
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
        this.enabled = true;
        this.id = GameObject.currentId++;
        this.moved = false;
    }

    /**********************************************************************************************
     * 
     * Methods related to components
     * 
     *********************************************************************************************/

    /**
     * @brief Returns whether or not the object is enabled.
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        if (enabled && !this.enabled) {
            this.moved = true;
        }
        this.enabled = enabled;
    }

    /**
     * @brief Returns whether or not the object has moved since the last frame.
     * Objects that should not be tested for collision will never return true
     * (disabled objects and objects without collider for example).
     */
    public hasMoved(): boolean {
        return this.enabled && this.collider != null && this.moved;
    }

    /**
     * @brief Makes hasMoved return false until the object is moved again.
     * This method is meant to be called by the physics engine at the end of a frame.
     * @see hasMoved
     */
    public resetMoved(): void {
        this.moved = false;
    }

    public getScene(): Scene {
        return this._scene as Scene;
    }

    public setScene(scene: Scene): void {
        this._scene = scene;
    }

    public getDisplay(): Display | undefined {
        return this.display;
    }

    public setDisplay(display?: Display): void {
        this.display = display;
    }

    public getCollider(): Collider | undefined {
        return this.collider;
    }

    public setCollider(collider?: Collider): void {
        this.collider = collider;
        this.moved = true;
    }

    public getBehaviour(): Behaviour | undefined {
        return this.behaviour;
    }

    public setBehaviour(behaviour?: Behaviour): void {
        this.behaviour = behaviour;
    }

    /**
     * @brief Updates the object and all of its components.
     * The returned value is that of hasMoved.
     */
    public update(): boolean {
        this.behaviour?.update();
        this.collider?.update();
        this.display?.update();
        return this.hasMoved();
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // save and restore are only necessary if sub-objects are handled
        // otherwise they're just a waste a time, provided we use setTransform instead of transform 
        // in Transform.applyToContext
        ctx.save();
        this.transform.applyToContext(ctx);
        this.display?.draw(ctx);
        if (this.collider != undefined) {
            this.collider.getShape().stroke(ctx);
        }
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
        this.moved = true;
    }

    /**
     * @brief Moves the object relative to its current transform.
     * If an object is perpetually rotating on itself, translating it with a vector of (1, 1)
     * will make it run in circle, while with move, it would move straight.
     */
    public translate(x: number, y: number): void {
        this.transform = this.transform.translate(x, y);
        this.moved = true;
    }

    /**
     * @brief Scales the object.
     * 1. is the neutral value for both parameters.
     * Negative values will flip the object in the corresponding axis.
     */
    public scale(x: number, y: number): void {
        this.transform = this.transform.scale(x, y);
        this.moved = true;
    }

    /**
     * @brief Rotates the object.
     * @param angle The angle, in radians.
     * @see rotateDegrees
     */
    public rotateRadians(angle: number): void {
        this.transform = this.transform.rotateRadians(angle);
        this.moved = true;
    }

    /**
     * @brief Rotates the object.
     * @param angle The angle, in degrees.
     * @see rotateRadians
     */
    public rotateDegrees(angle: number): void {
        this.transform = this.transform.rotateDegrees(angle);
        this.moved = true;
    }

    /**
     * @brief Slants the object.
     */
    public shear(x: number, y: number): void {
        this.transform = this.transform.shear(x, y);
        this.moved = true;
    }
}