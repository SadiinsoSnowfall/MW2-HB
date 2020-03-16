import { Scene } from "./engine/scene";
import { InputManager } from "./utils/inputManager";

export class CScreen {
    private static readonly AVG_FRAMETIME_COUNT = 15;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private scene?: Scene;

    public readonly width: number;
    public readonly height: number;
    public readonly AR: number;

    private frame: number;
    private frameTime: number;
    private lastrefresh: number;

    private rft: number; // real frame time
    private rft_accumulator: number;

    private doUpdate: boolean = true;

    constructor(canvas: HTMLCanvasElement, height: number, AR: number) {
        this.canvas = canvas;
        let ctx = canvas.getContext("2d");
        if (ctx == null) {
            throw new Error("Unable to get 2D context");
        }

        this.context = ctx;
        this.AR = AR;
        this.width = this.canvas.width = height * AR;
        this.height = this.canvas.height = height;

        // Starts game loop
        this.frame = this.frameTime = this.lastrefresh = this.rft = this.rft_accumulator = 0;
        requestAnimationFrame(() => this.update());

        // add listener to switch the game in fullscreen mode
        InputManager.subscribe('Enter', () => this.canvas.requestFullscreen());

        // add listener to freeze / unfreeze the scene rendering
        InputManager.subscribe(['Shift', 'Enter'], () => {
            if(this.doUpdate = !this.doUpdate) {
                requestAnimationFrame(() => this.update());
            }
        });
    }

    private update(): void {
        if (this.doUpdate) {
            requestAnimationFrame(() => this.update());
        }

        let updateBegin = performance.now();
        this.scene = this.scene?.update();
        this.draw();
        let updateEnd = performance.now();
        this.rft_accumulator += (updateEnd - updateBegin);

        if (this.frame % CScreen.AVG_FRAMETIME_COUNT == 0) {
            // update frametime
            this.frameTime = (updateEnd - this.lastrefresh) / CScreen.AVG_FRAMETIME_COUNT;
            this.lastrefresh = updateEnd;

            // update real frametime
            this.rft = this.rft_accumulator / CScreen.AVG_FRAMETIME_COUNT;
            this.rft_accumulator = 0;
        }
    }

    private draw(): void {
        if (this.scene) {
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.save();
            this.scene?.draw(this.context);
            this.context.restore();
            ++this.frame;
        }
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getScene(): Scene | undefined {
        return this.scene;
    }

    public setScene(scene: Scene): void {
        scene.setScreen(this);
        this.scene = scene;
    }

    public currentFrame(): number {
        return this.frame;
    }

    /**
     * The current time it take for the scene to be rendered
     * (updated every 15 frames)
     */
    public framerate(): number {
        return this.frameTime;
    }

    /**
     * The current time it takes for the scene to be rendered excluding Vsync
     * (updated every 15 frames)
     */
    public realFramerate(): number {
        return this.rft;
    }

}

let canvas = document.getElementsByTagName('canvas')[0];
InputManager.init(canvas);
export const screen: CScreen = new CScreen(canvas, 1080, 16 / 9);