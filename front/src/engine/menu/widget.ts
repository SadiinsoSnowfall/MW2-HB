import { Vec2 } from "../utils";
import { Menu } from './';
import { assert } from "../../utils";

export abstract class Widget {
    protected menu: Menu | undefined;
    protected pos: Vec2; // position relative to the menu
    protected size: Vec2; // size of the widget
    protected clickCallback: () => void;

    constructor(pos: Vec2, size: Vec2) {
        this.pos = pos;
        this.size = size;
        this.clickCallback = () => {};
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public getPosition(): Vec2 {
        return this.pos;
    }

    public setPosition(pos: Vec2): void {
        this.pos = pos;
    }

    public getSize(): Vec2 {
        return this.size;
    }

    public setSize(size: Vec2): void {
        this.size = size;
    }

    public getMenu(): Menu | undefined {
        return this.menu;
    }

    public relativeTo(menu: Menu): Widget {
        this.menu = menu;
        return this;
    }

    public setAlignedMiddle(): void {
        assert(this.menu !== undefined, "Widget#setAlignedMiddle: no relative menu");
        const menu = this.menu as Menu; // ensured by he assert
        const msize = menu.getSize();
        this.pos.setXY(msize.x / 2, msize.y / 2);
    }

    public onClick(callback: () => void): void {
        this.clickCallback = callback;
    }

    public abstract onHoverEnter(): void;
    public abstract onHoverLeft(): void;

}