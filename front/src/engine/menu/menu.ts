import { Button } from "./button";
import { Vec2 } from "../utils";
import { Widget } from "./widget";
import { inRect } from "../../utils";

export class Menu {
    public zIndex: number; // the menu zIndex, 0 is the game

    private widgets: Widget[];
    private pos: Vec2;
    private size: Vec2;
    private background: string;
    private visible: boolean;

    constructor(pos: Vec2, size: Vec2, background: string = "#696969", zIndex: number = 1) {
        this.pos = pos;
        this.size = size;
        this.zIndex = zIndex;
        this.background = background;
        this.visible = false;
        this.widgets = [];
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public setVisible(visible: boolean): void {
        this.visible = visible;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) {
            return;
        }


        ctx.fillStyle = this.background;
        ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        ctx.setTransform(1, 0, 0, 1, this.pos.x, this.pos.y); // translate to [x, y]

        for (let i = 0; i < this.widgets.length; ++i) {
            this.widgets[i].draw(ctx);
        }
    }

    public captureEvent(e: MouseEvent): boolean {
        if (!this.visible || !inRect(e.clientX, e.clientY, this.pos.x, this.pos.y, this.size.x, this.size.y)) {
            return false;
        }

        return true;
    }

    public add(widget: Widget): void {
        widget.setMenu(this);
        this.widgets.push(widget);
    }

}