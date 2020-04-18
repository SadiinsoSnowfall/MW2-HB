import { Button } from "./button";
import { Vec2 } from "../utils";
import { Widget } from "./widget";
import { inRectVec2, inRect } from "../../utils";
import { screen } from "../../screen";
import { MouseAction } from "../../utils/inputManager";

export class Menu {
    public zIndex: number; // the menu zIndex, 0 is the game

    private widgets: Widget[];
    private pos: Vec2;
    private size: Vec2;
    private background: string;
    private visible: boolean;

    // keep track of the widget hovered on
    private lastHoverWidget: Widget | null = null;

    constructor(zIndex: number = 1, background: string = "#696969") {
        this.pos = Vec2.Zero.clone();
        this.size = Vec2.Zero.clone();
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

    public setNoBackground(): void {
        this.background = 'transparent';
    }

    public getPosition(): Vec2 {
        return this.pos;
    }

    public setPosition(pos: Vec2): void {
        this.pos = pos;
    }

    public setAlignedMiddle(): void {
        this.pos.x = screen.width / 2 - this.size.x / 2;
        this.pos.y = screen.height / 2 - this.size.y / 2;
    }

    public setSize(size: Vec2): void {
        this.size = size;
    }

    public getSize(): Vec2 {
        return this.size;
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

    public captureEvent(e: MouseEvent, type: number, pos: Vec2): boolean {
        // fast check against menu boundaries
        if (!this.visible || !inRectVec2(pos, this.pos, this.size)) {
            return false;
        }

        let captured: Widget | null = null;

        for (let i = 0; i < this.widgets.length; ++i) {
            const w = this.widgets[i];
            const wp = w.getPosition();
            const ws = w.getSize();

            const x = this.pos.x + wp.x - ws.x / 2;
            const y = this.pos.y + wp.y - ws.y / 2;

            if (inRect(pos.x, pos.y, x, y, ws.x, ws.y)) {
                captured = w;
                break;
            }
        }

        if (type == MouseAction.MOVE) {
            if (captured) {
                // in case of switching between two widgets
                if (this.lastHoverWidget && (this.lastHoverWidget !== captured)) {
                    this.lastHoverWidget.onHoverLeft();
                    this.lastHoverWidget = null;
                }

                if (!this.lastHoverWidget) {
                    captured.onHoverEnter();
                    this.lastHoverWidget = captured;
                }
            } else {
                if (this.lastHoverWidget) {
                    this.lastHoverWidget.onHoverLeft();
                    this.lastHoverWidget = null;
                }
            }
        } else {

        }


        return captured !== null;
    }

    public add(widget: Widget): void {
        this.widgets.push(widget.relativeTo(this));
    }

}