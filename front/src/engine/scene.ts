import { GameObject } from "./gameObject";
import { RigidBody, Display, Collider, Behaviour } from './components';

/**
 * @brief Defines any object that can interact with the game loop.
 */
export interface Scene {
    /**
     * @brief Displays this Scene on a canvas.
     * @param ctx The context from the canvas the scene must be drawn on.
     */
    draw(ctx: CanvasRenderingContext2D): void;

    /**
     * @brief Updates the game without displaying it.
     * @returns The next scene to update and display (usually, itself)
     */
    update(): Scene;
}

/**
 * @brief A dull implementation of Scene for the sole purpose of testing.
 */
export class DullScene implements Scene {
    private objects: GameObject[];

    constructor() {
        this.objects = [];
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (let o of this.objects) {
            o.draw(ctx);
        }
    }

    public update(): Scene {
        for (let o of this.objects) {
            o.update();
        }
        return this;
    }

    public addWigglyThingy(x: number, y: number, c: string = "#008000", a: number = 0.01, w: number = 50, h: number = 75) {
        let o = new GameObject(x, y);
        o.setDisplayComponent(new WigglyDisplay(o, c, w, h));
        o.setBehaviourComponent(new WigglyBehaviour(o, a));
        this.objects.push(o);
    }
}

class WigglyBehaviour extends Behaviour {

    private rotation: number;

    constructor(o: GameObject, rotation: number) {
        super(o);
        this.rotation = rotation;
    }

    public update(): void {
        this.object.rotateRadians(this.rotation);
    }
}

class WigglyDisplay extends Display {
    private color: string;
    private width: number;
    private height: number;

    constructor(o: GameObject, c: string, w: number, h: number) {
        super(o);
        this.color = c;
        this.width = w;
        this.height = h;
    }

    public update(): void {}

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        // x and y must be 0!
        // The position is implicitly set through the Transform of the object
        // Thus, here x and y don't set the actual offset but rather the offset relative to the center of the object
        // Here we want our object to be the ellipse, so it doesn't make sense to put any value other than 0
        ctx.ellipse(0, 0, this.width, this.height, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}