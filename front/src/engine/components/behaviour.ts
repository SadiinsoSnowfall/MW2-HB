import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";
import { Vec2 } from '../utils';

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

    public onClick(pos: Vec2): void {}
    public onMouseDown(pos: Vec2): void {}
    public onMouseUp(pos: Vec2): void {}
    public onMouseMove(pos: Vec2): void {}

    public isInside(pos: Vec2): boolean {
        return false;
    }

}