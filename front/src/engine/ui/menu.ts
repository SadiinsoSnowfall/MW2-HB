import { MouseAction } from "../res/inputManager";
import { Vec2 } from "../utils/vec2";
import { inRectVec2, inRect } from "../utils/utils";
import { Widget } from "./widget";
import { Element } from './element'

export class Menu extends Element {
    private widgets: Widget[];
    private background: string | HTMLImageElement;

    private static screenWidth: number = 1920;
    private static screenHeight: number = 1080;

    // keep track of the widget hovered on
    private lastHoverWidget: Widget | null = null;

    constructor(zIndex: number = 1) {
        super(zIndex, false);
        this.background = 'transparent';
        this.widgets = [];
    }

    /**
     * Set the widget position
     * if x is negative, it will take the value of menu.width + x (like in python list slices)
     * same thing for y
     */
    public setPositionXY(x: number, y: number): Menu {
        if (x >= 0 && !Object.is(x, -0)) {
            this.pos.x = x;
        } else {
            this.pos.x = Menu.screenWidth + x;
        }

        if (y >= 0 && !Object.is(y, -0)) {
            this.pos.y = y;
        } else {
            this.pos.y = Menu.screenHeight + y;
        }

        return this;
    }

    public setBackground(bg: string | HTMLImageElement = 'transparent'): Menu {
        this.background = bg;
        return this;
    }

    public setAlignedMiddle(): Menu {
        this.pos.x = screen.width / 2 - this.size.x / 2;
        this.pos.y = screen.height / 2 - this.size.y / 2;
        return this;
    }

    public setFullScreen(): Menu {
        this.pos.setXY(0, 0);
        this.size.setXY(screen.width, screen.height);
        return this;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.visible) {
            return;
        }

        if (typeof this.background === 'string') {
            ctx.fillStyle = this.background;
            ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
        } else {
            ctx.drawImage(this.background, 0 , 0, this.size.x, this.size.y);
        }
       
        ctx.setTransform(1, 0, 0, 1, this.pos.x, this.pos.y); // translate to [x, y]

        for (let i = 0; i < this.widgets.length; ++i) {
            if (this.widgets[i].isVisible()) {
                this.widgets[i].draw(ctx);
            }
        }
    }

    public captureEvent(type: number, pos: Vec2): boolean {
        // fast check against menu boundaries
        if (!this.visible || !this.doCaptureEvent || !inRectVec2(pos, this.pos, this.size)) {
            return false;
        }

        let captured: Widget | null = null;

        for (let i = this.widgets.length - 1; i >= 0; --i) {
            const w = this.widgets[i];
            const wp = w.getPosition();
            const ws = w.getSize();

            const x = this.pos.x + wp.x - ws.x / 2;
            const y = this.pos.y + wp.y - ws.y / 2;

            if (w.doCapture() && inRect(pos.x, pos.y, x, y, ws.x, ws.y)) {
                captured = w;
                break;
            }
        }

        if (type == MouseAction.MOVE) { // handle hover
            if (captured) {
                // in case of switching between two widgets
                if (this.lastHoverWidget && (this.lastHoverWidget !== captured)) {
                    this.lastHoverWidget.hoverLeft();
                    this.lastHoverWidget = null;
                }

                if (!this.lastHoverWidget) {
                    captured.hoverEnter();
                    this.lastHoverWidget = captured;
                }
            } else {
                if (this.lastHoverWidget) {
                    this.lastHoverWidget.hoverLeft();
                    this.lastHoverWidget = null;
                }
            }
        } else if (type == MouseAction.LEFT_CLICK && captured != null) { // handle click
            captured.click();
        }


        return true;
    }

    public hoverLeft() {
        if (this.lastHoverWidget) {
            this.lastHoverWidget.hoverLeft();
            this.lastHoverWidget = null;
        }
    }
    
    public resort(): void {
        this.widgets.sort((a, b) => a.getZIndex() - b.getZIndex()); // sort by zIndex, ascending order
    }

    public add(widget: Widget): Widget {
        this.widgets.push(widget.relativeTo(this));
        this.resort(); // sort by zIndex
        return widget;
    }

}