import { GameObject } from '../gameObject';
import { ObjectComponent } from "./objectComponent";
import { Vec2 } from '../utils/vec2';

/**
 * ObjectComponent for scripting objects
 */
export abstract class Behaviour extends ObjectComponent {
    public isClickable = false;
    
    constructor(object: GameObject) {
        super(object);
    }

    public setClickable(): void {
       this.isClickable = true;
    }

    public update(): void {}

    /**
     * Notify when a collision occue between the GO and another one
     */
    public onCollide(mag: number): void {}

    public onClick(pos: Vec2): void {}
    public onMouseDown(pos: Vec2): void {}
    public onMouseUp(pos: Vec2): void {}
    public onMouseMove(pos: Vec2): void {}

    public isInside(pos: Vec2): boolean {
        return false;
    }

}