import { Scene, DullScene } from "./engine/scene";


export class CScreen {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private scene?: Scene;
    
    public readonly width: number;
    public readonly height: number;
    public readonly AR: number;
    
    private _frame: number;

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
        this._frame = 0;
        let _this = this;
        let updater = function() {
            _this.scene = _this.scene?.update();
            _this.draw();
            requestAnimationFrame(updater);
        };
        requestAnimationFrame(updater);

        // add listener to switch the game in fullscreen mode
        addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.canvas.requestFullscreen();
            }
        });
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
        return this._frame;
    }

    public draw(): void {
        if (this.scene) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.save();
            this.scene?.draw(this.context);
            this.context.restore();
            ++this._frame;
        }
    }
}

let canvas = document.getElementsByTagName('canvas')[0];
export const screen: CScreen = new CScreen(canvas, 1080, 16/9);