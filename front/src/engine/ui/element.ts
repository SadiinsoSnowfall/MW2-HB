import { Vec2, EMPTY_FUNCTION } from "../utils";

export class Element {
    protected visible: boolean;
    protected zIndex: number;
    protected pos: Vec2;
    protected size: Vec2;
    protected doCaptureEvent: boolean;

    protected onDisplayCallback: () => void;
    protected onHideCallback: () => void;

    constructor(zIndex: number = 1, visible: boolean = true, pos: Vec2 = Vec2.Zero.clone(), size: Vec2 = Vec2.Zero.clone()) {
        this.pos = pos;
        this.size = size;
        this.zIndex = zIndex;
        this.visible = visible;
        this.onDisplayCallback = this.onHideCallback = EMPTY_FUNCTION;
        this.doCaptureEvent = true;
    }

    public doCapture(): boolean {
        return this.doCaptureEvent;
    }

    public setDoCapture(state: boolean): Element {
        this.doCaptureEvent = state;
        return this;
    }

    public setZIndex(zIndex: number): Element {
        this.zIndex = zIndex;
        return this;
    }

    public getZIndex(): number {
        return this.zIndex;
    }

    public getPosition(): Vec2 {
        return this.pos;
    }

    public setPositionXY(x: number, y: number): void {
        this.pos.x = x;
        this.pos.y = y;
    }

    public setPosition(pos: Vec2): void {
        this.setPositionXY(pos.x, pos.y);
    }

    public translateXY(x: number, y: number): void {
        this.pos.x += x;
        this.pos.y += y;
    }

    public translate(factor: Vec2): void {
        this.pos.add(factor);
    }

    public getSize(): Vec2 {
        return this.size;
    }

    public setSizeXY(w: number, h: number): void {
        this.size.x = w;
        this.size.y = h;
    }

    public setSize(size: Vec2): void {
        this.setSizeXY(size.x, size.y);
    }

    /**
     * Toggle the element visibility
     */
    public toggle(): Element {
        return this.setVisible(!this.visible);
    }

    /**
     * Return whether or nut the menu is currently visible
     */
    public isVisible(): boolean {
        return this.visible;
    }

    /**
     * Set the element visibility
     */
    public setVisible(visible: boolean): Element {
        if (visible && !this.visible) {
            this.onDisplayCallback();
        } else if (!visible && this.visible) {
            this.onHideCallback();
        }

        this.visible = visible;
        return this;
    }

    public onDisplay(callback: () => void): void {
        this.onDisplayCallback = callback;
    }

    public onHide(callback: () => void): void {
        this.onHideCallback = callback;
    }

}