import { Vec2 } from "../utils";
import { Menu } from './';

export abstract class Widget {
    protected menu: Menu | undefined;
    protected pos: Vec2; // position relative to the menu
    protected clickCallback: () => void;

    constructor(pos: Vec2) {
        this.pos = pos;
        this.clickCallback = () => {};
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;

    public getPosition(): Vec2 {
        return this.pos;
    }

    public setPosition(pos: Vec2): void {
        this.pos = pos;
    }

    public getMenu(): Menu | undefined {
        return this.menu;
    }

    public setMenu(menu: Menu): void {
        this.menu = menu;
    }

    public onClick(callback: () => void): void {
        this.clickCallback = callback;
    }

}