import { Scene, DullScene } from "./engine/scene";


export class CScreen {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private scene: Scene;
    
    public readonly width: number;
    public readonly height: number;
    public readonly AR: number;

    constructor(canvas: HTMLCanvasElement, height: number, AR: number, scene: Scene) {
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
        this.scene = scene;
        let _this = this;
        let updater = function() {
            _this.scene = scene.update();
            _this.draw();
            window.requestAnimationFrame(updater);
        };
        window.requestAnimationFrame(updater);

        // add listener to switch the game in fullscreen mode
        window.addEventListener("keydown", (e: KeyboardEvent) => {
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

    public getScene(): Scene {
        return this.scene;
    }

    public setScene(scene: Scene): void {
        this.scene = scene;
    }

    public draw(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.save();
        this.scene.draw(this.context);
        this.context.restore();
    }
}

let canvas = document.getElementsByTagName('canvas')[0];

export const screen: CScreen = new CScreen(canvas, 1080, 16/9, new DullScene());