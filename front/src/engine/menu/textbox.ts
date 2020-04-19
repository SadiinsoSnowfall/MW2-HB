import { Widget } from "./widget";
import { Text, Alignment, Style, TextFormat } from "../../engine/utils/textFormat";

export class TextBox extends Widget {
    private text: Text;
    private init: boolean;

    constructor(message: string[], a: Alignment = Alignment.LEFT, s: Style = Style.FILL) {
        super();
        this.text = new Text(TextFormat.using(a, s), message);
        this.init = false;
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