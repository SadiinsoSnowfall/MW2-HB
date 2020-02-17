import { GameObject } from "./gameObject";
import { RigidBody, Display, Collider, Behaviour } from './components';
import { CScreen } from "../screen";

/**
 * @brief Defines any object that can interact with the game loop.
 */
export abstract class Scene {
    private _screen?: CScreen;

    /**
     * @brief Retrieve the CScreen the scene is displayed on
     * @returns The CScreen the scene is displayed on
     */
    public screen(): CScreen | undefined {
        return this._screen;
    }

    /**
     * @brief Set the CScreen of the scene
     */
    public setScreen(screen: CScreen): void {
        this._screen = screen;
    }

    /**
     * @brief Shortcut for screen().currentFrame()
     * @returns The current frame being displayed or -1 if the scene is not rendered
     */
    public tick(): number {
        return this._screen?.currentFrame() || -1;
    }

    /**
     * @brief Displays this Scene on a canvas.
     * @param ctx The context from the canvas the scene must be drawn on.
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;

    /**
     * @brief Updates the game without displaying it.
     * @returns The next scene to update and display (usually, itself)
     */
    abstract update(): Scene;
}

/**
 * @brief A dull implementation of Scene for the sole purpose of testing.
 */
export class DullScene extends Scene {
    private objects: GameObject[];

    constructor() {
        super();
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

    public addWigglyThingy(x: number, y: number, c: string = "#008000", a: number = 0.01, w: number = 50, h: number = 75): void {
        let o = new GameObject(x, y);
        o.setDisplayComponent(new WigglyDisplay(o, c, w, h));
        o.setBehaviourComponent(new WigglyBehaviour(o, a));
        o.setScene(this);
        this.objects.push(o);
    }

    public addSpinnyThingy(x: number, y: number, c: string = "#008080", a: number = 0.01, r: number = 50): void {
        let o = new GameObject(x, y);
        o.setDisplayComponent(new SpinnyDisplay(o, c, r));
        o.setBehaviourComponent(new SpinnyBehaviour(o, a));
        o.setScene(this);
        this.objects.push(o);
    }

    public addFPSMetter(x: number, y: number): void {
        let o = new GameObject(x, y);
        o.setDisplayComponent(new FPSMetterBehaviour(o));
        o.setScene(this);
        this.objects.push(o);
    }
}

class WigglyBehaviour extends Behaviour {
    private rotation: number;
    private updates: number;
    private last: number;

    private static smooth: number = 8;
    private static variance: number = 5; // Opposite of (variance / 2) actually

    constructor(o: GameObject, rotation: number) {
        super(o);
        this.rotation = rotation;
        this.updates = Math.floor(Math.random() * WigglyBehaviour.smooth);
        this.last = 1;
    }

    public update(): void {
        this.object.rotateRadians(this.rotation);
        let factor = (Math.cos(this.updates / WigglyBehaviour.smooth)) / WigglyBehaviour.variance + 1;
        this.object.scale(1 / this.last, 1/* / this.last*/);
        this.object.scale(factor, /*factor*/1);
        this.last = factor;
        this.updates++;
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

class SpinnyBehaviour extends Behaviour {
    private rotation: number;

    constructor(o: GameObject, rotation: number) {
        super(o);
        this.rotation = rotation;
        o.scale(2, 0.5);
    }

    public update(): void {
        this.object.rotateRadians(this.rotation);
    }
}

class SpinnyDisplay extends Display {
    private color: string;
    private radius: number;

    constructor(o: GameObject, c: string, r: number) {
        super(o);
        this.color = c;
        this.radius = r;
    }

    public update(): void {}

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        //ctx.ellipse(0, 0, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.fillRect(-this.radius / 2, -this.radius / 2, this.radius, this.radius);
        ctx.closePath();
    }
}

class FPSMetterBehaviour extends Display {
    constructor(o: GameObject) {
        super(o);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        let tick = this.object?.scene()?.tick();
        ctx.font = '48px sans';
        ctx.fillText("Current frame: " + tick, 0, 0);
    }
}