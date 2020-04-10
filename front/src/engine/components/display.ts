import { GameObject } from '../gameObject';
import { ObjectComponent } from "./";

/**
 * ObjectComponent for graphic display
 */
export class Display extends ObjectComponent {

    constructor(object: GameObject) {
        super(object);
    }

    public update(delta: number): boolean {
        return false;
    }

    public draw(ctx: CanvasRenderingContext2D): void {}
}