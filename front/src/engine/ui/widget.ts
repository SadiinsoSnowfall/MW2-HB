import { Vec2 } from "../utils";
import { Element, Menu } from '.';
import { assert, EMPTY_FUNCTION } from "../utils";

export abstract class Widget extends Element {
    protected menu: Menu | undefined;
    protected clickCallback: () => void;
    protected hoverCallback: () => void;

    constructor(zIndex?: number, pos?: Vec2, size?: Vec2) {
        super(zIndex, true, pos, size);
        this.clickCallback = this.hoverCallback = EMPTY_FUNCTION;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public getMenu(): Menu | undefined {
        return this.menu;
    }

    public relativeTo(menu: Menu): Widget {
        this.menu = menu;
        return this;
    }

    /**
     * Set the widget position
     * if x is negative, it will take the value of menu.width + x (like in python list slices)
     * same thing for y
     */
    public setPositionXY(x: number, y: number): void {
        const menu = this.menu as Menu; // ensured by he assert

        if (x >= 0) {
            this.pos.x = x;
        } else {
            assert(this.menu !== undefined, "Widget#setPositionXY: negative index: no relative menu");
            this.pos.x = menu.getSize().x + x;
        }

        if (y >= 0) {
            this.pos.y = y;
        } else {
            assert(this.menu !== undefined, "Widget#setPositionXY: negative index: no relative menu");
            this.pos.y = menu.getSize().y + y;
        }
    }

    /**
     * Set the Z-Index of the widget
     * /!\ will cause a widget resorting in the relative menu
     */
    public setZIndex(zIndex: number): Widget {
        this.zIndex = zIndex;
        this.menu?.resort();
        return this;
    }

    public setAlignedMiddle(): void {
        assert(this.menu !== undefined, "Widget#setAlignedMiddle: no relative menu");
        const menu = this.menu as Menu; // ensured by he assert
        const msize = menu.getSize();
        this.pos.setXY(msize.x / 2, msize.y / 2);
    }

    public setAlignedMiddleX(): void {
        assert(this.menu !== undefined, "Widget#setAlignedMiddleX: no relative menu");
        const menu = this.menu as Menu; // ensured by he assert
        this.pos.x = menu.getSize().x / 2;
    }

    public setAlignedMiddleY(): void {
        assert(this.menu !== undefined, "Widget#setAlignedMiddleY: no relative menu");
        const menu = this.menu as Menu; // ensured by he assert
        this.pos.y = menu.getSize().y / 2;
    }

    /**
     * Set a function to execute when the widget is hovered
     * @param callback The function to execute
     */
    public onHover(callback: () => void): void {
        this.hoverCallback = callback;
    }

    /**
     * Set a function to execute when the widget is clicked
     * @param callback The function to execute
     */
    public onClick(callback: () => void): void {
        this.clickCallback = callback;
    }

    /**
     * Simulate a click on the widget
     */
    public click(): void {
        this.clickCallback();
    }

    public abstract hoverEnter(): void;
    public abstract hoverLeft(): void;

}