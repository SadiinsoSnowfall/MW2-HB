import { Display } from "../../engine/components";
import { Spritesheet, Sprite } from "../../engine/utils";
import { GameObject } from "../../engine/gameObject";
import { Damagable } from "./baseComponents";

export class PigDisplay extends Display {
    private sheet: Spritesheet;
    private sprite: Sprite;

    constructor(o: GameObject, sheet: Spritesheet) {
        super(o);
        this.sheet = sheet;
        this.sprite = sheet.getSpriteAbsolute(0);
    }

    public useSprite(id: number): void {
        this.sprite = this.sheet.getSpriteAbsolute(id);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }
}

export class PigBehaviour extends Damagable {

    constructor(o: GameObject, health: number, hitSounds: string[] = [], damageSound: string[] = [], destroySound: string[] = []) {
        super(o, health, hitSounds, damageSound, destroySound);
    }

    public update(): boolean {
        return false;
    }

}