import { Display, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet } from "../../engine/utils";

export class BirdDisplay extends Display {
    protected sheet: Spritesheet;

    constructor(o: GameObject, sheet: Spritesheet) {
        super(o);
        this.sheet = sheet;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sheet.getSpriteAbsolute(0).draw(ctx);
    }
}

export class BaseBirdBehaviour extends Behaviour {
    public touched: boolean = false;

    constructor(o: GameObject) {
        super(o);
    }


}
