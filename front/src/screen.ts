

export class CScreen {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    
    public readonly width: number;
    public readonly height: number;
    public readonly AR: number;

    constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, height: number, AR: number) {
        this.canvas = canvas;
        this.context = context;
        this.AR = AR;
        this.width = this.canvas.width = height * AR;
        this.height = this.canvas.height = height;

        // add listener to switch the game in fullscreen mode
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.canvas.requestFullscreen();
            }
        })
    }

    public getContext(): CanvasRenderingContext2D {
        return this.context;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

}

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

if (ctx == null) {
    throw new Error('Unable to get 2D context');
}

export const screen: CScreen = new CScreen(canvas, ctx, 1080, 16/9);