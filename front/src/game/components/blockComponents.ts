import { Display, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";
import { assert } from "../../utils";

/**
 * Virtual Spritesheet Block Display
 * 
 * take a spritesheet and a collumn index
 */
export class VSBlockDisplay extends Display {
    private sheet: Spritesheet;
    private col: number;
    private sprite: Sprite;

    constructor(o: GameObject, sheet: Spritesheet, col: number) {
        super(o);
        this.sheet = sheet;
        this.col = col;
        this.sprite = sheet.getSprite(this.col, 0)
    }

    public useSprite(id: number): void {
        this.sprite = this.sheet.getSprite(this.col, id);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }

}

export class BlockBehaviour extends Behaviour {
    private readonly maxHealth: number;
    private health: number;
    private display: VSBlockDisplay;

    constructor(o: GameObject, health: number) {
        super(o);
        this.maxHealth = health;
        this.health = health;

        const display = o.displayComponent();
        assert(display instanceof VSBlockDisplay, 'BlockBehaviour#init: target object display is not a VSBlockDisplay');
        this.display = display as VSBlockDisplay;
    }

    public applyDamage(damage: number): void {
        this.health -= damage;

        if (this.health <= 0) {
            this.object.setEnabled(false); // destroy the object
        } else {
            // find the quarter to use and update the sprite accordingly 
            const quarter = Math.ceil((this.health / (this.maxHealth / 4))) - 1;
            this.display.useSprite(quarter);
        }
    }

    public update(): void {
        
    }
}