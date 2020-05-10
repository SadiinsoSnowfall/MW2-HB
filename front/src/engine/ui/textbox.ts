import { Widget } from "./widget";
import { Alignment, Style, TextFormat, Text } from "../utils/textFormat";

export class TextBox extends Widget {
    private text: Text;
    private init: boolean;

    constructor(message: string[], a: Alignment = Alignment.LEFT, s: Style = Style.FILL) {
        super();
        const tf = TextFormat.using(a, s).setFont('AngryBirds');
        this.text = new Text(tf, message);
        this.init = false;
        this.doCaptureEvent = false;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.init) {
            this.text.refresh(ctx);
        }

        ctx.translate(this.pos.x, this.pos.y);
        this.text.draw(ctx);
        ctx.translate(-this.pos.x, -this.pos.y);
    }

    public hoverEnter(): void {
        this.hoverCallback();
    }

    public hoverLeft(): void { }
    
}