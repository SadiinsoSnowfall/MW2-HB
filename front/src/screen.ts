import { Scene } from "./engine/scene";

export class CScreen {
    private static readonly AVG_FRAMETIME_COUNT = 15;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private scene?: Scene;
    
    public readonly width: number;
    public readonly height: number;
    public readonly AR: number;
    
    private _frame: number;
    private _frameTime: number;
    private _lastrefresh: number;
    
    private _rft: number; // real frame time
    private _rft_accumulator: number;

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
        this._frame = this._frameTime = this._lastrefresh = this._rft = this._rft_accumulator = 0;
        let _this = this;

        let updater = function() {
            let tmp = Date.now();
            _this.scene = _this.scene?.update();
            _this.draw();
            _this._rft_accumulator += (Date.now() - tmp);
            
            if (_this._frame % CScreen.AVG_FRAMETIME_COUNT == 0) {
                // update frametime
                _this._frameTime = (Date.now() - _this._lastrefresh) / CScreen.AVG_FRAMETIME_COUNT;
                _this._lastrefresh = Date.now();

                // update real frametime
                _this._rft = _this._rft_accumulator / CScreen.AVG_FRAMETIME_COUNT;
                _this._rft_accumulator = 0;
            }
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

    /**
     * The current time it take for the scene to be rendered
     * (updated every 15 frames)
     */
    public framerate(): number {
        return this._frameTime;
    }

    /**
     * The current time it takes for the scene to be rendered excluding Vsync
     * (updated every 15 frames)
     */
    public realFramerate(): number {
        return this._rft;
    }

    public draw(): void {
        if (this.scene) {
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.save();
            this.scene?.draw(this.context);
            this.context.restore();
            ++this._frame;
        }
    }
}

let canvas = document.getElementsByTagName('canvas')[0];
export const screen: CScreen = new CScreen(canvas, 1080, 16/9);