import { Vec2 } from "../utils";
import { Element, Widget } from "./";
import { inRectVec2, inRect, EMPTY_FUNCTION } from "../../utils";
import { screen } from "../../screen";
import { MouseAction } from "../../utils/inputManager";
import { MenuManager } from "./menumanager";

export class Menu extends Element {
    private widgets: Widget[];
    private background: string | HTMLImageElement;
    private visible: boolean;

    private onDisplayCallback: () => void;
    private onHideCallback: () => void;

    // keep track of the widget hovered on
    private lastHoverWidget: Widget | null = null;

    constructor(zIndex: number = 1) {
        super();
        this.zIndex = zIndex;
        this.background = 'transparent';
        this.visible = false;
        this.widgets = [];
        this.onDisplayCallback = this.onHideCallback = EMPTY_FUNCTION;
    }

    public isVisible(): boolean {
        return this.visible;
    }

    public setVisible(visible: boolean): void {
        if (visible && !this.visible) {
            this.onDisplayCallback();
        } else if (!visible && this.visible) {
            this.onHideCallback();
        }

        this.visible = visible;
    }

    public onDisplay(callback: () => void): void {
        this.onDisplayCallback = callback;
    }

    public onHide(callback: () => void): void {
        this.onHideCallback = callback;
    }

    public setBackground(bg: string | HTMLImageElement = 'transparent'): void {
        this.background = bg;
    }

    public setAlignedMiddle(): void {
        this.pos.x = screen.width / 2 - this.size.x / 2;
        this.pos.y = screen.height / 2 - this.size.y / 2;
    }

    public setFullScreen(): void {
        this.size.setXY(screen.width, screen.height);
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
            this.widgets[i].draw(ctx);
        }
    }

    public captureEvent(e: MouseEvent, type: number, pos: Vec2): boolean {
        // fast check against menu boundaries
        if (!this.visible || !inRectVec2(pos, this.pos, this.size)) {
            return false;
        }

        let captured: Widget | null = null;

        for (let i = this.widgets.length - 1; i >= 0; --i) {
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


        return captured !== null;
    }

    public setZIndex(zIndex: number): void {
        this.zIndex = zIndex;
        MenuManager.resort();
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