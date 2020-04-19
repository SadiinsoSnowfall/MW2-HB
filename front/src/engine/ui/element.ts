import { Vec2 } from "../utils";

export class Element {
    protected zIndex: number;
    protected pos: Vec2;
    protected size: Vec2;

    constructor(zIndex: number = 1, pos: Vec2 = Vec2.Zero.clone(), size: Vec2 = Vec2.Zero.clone()) {
        this.pos = pos;
        this.size = size;
        this.zIndex = zIndex;
    }

    public setZIndex(zIndex: number): void {
        this.zIndex = zIndex;
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

}