import { Display, RigidBody } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";
import { assert } from "../../utils";
import { Damagable } from "./baseComponents";

export interface BlockDisplay {
    useSprite(id: number): void;
};

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
        this.sprite = sheet.getSprite(this.col, 0);
    }

    public useSprite(id: number): void {
        this.sprite = this.sheet.getSprite(this.col, id);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }

}

/**
 * Horizontal Spritesheet Block Display
 */
export class HSBlockDisplay extends Display {
    private sheet: Spritesheet;
    private base: number;
    private sprite: Sprite;

    constructor(o: GameObject, sheet: Spritesheet, row: number) {
        super(o);
        this.sheet = sheet;
        this.base = row;
        this.sprite = sheet.getSprite(0, row);
    }

    public useSprite(id: number): void {
        this.sprite = this.sheet.getSprite(0, this.base + id);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }

}

export class BlockBehaviour extends Damagable {
    private spriteIndex: number;
    private display: BlockDisplay;

    constructor(o: GameObject, health: number) {
        super(o, health);
        this.spriteIndex = 0;

        const display = o.displayComponent();
        this.display = (display as VSBlockDisplay) as BlockDisplay;
    }

    public setHealth(health: number) {
        this.health = Math.min(this.maxHealth, health);
        this.display.useSprite(4 - Math.ceil((this.health / (this.maxHealth / 4))))
    }

    public applyDamage(damage: number): void {
        this.health -= damage;

        if (this.health <= 0) {
            //TODO emmit destroy particles & sound
            this.object.setEnabled(false); // destroy the object
        } else {
            // find the quarter to use and update the sprite accordingly 
            const quarter = 4 - Math.ceil((this.health / (this.maxHealth / 4)));
            
            if (this.spriteIndex != quarter) {
                this.display.useSprite(quarter);
                this.spriteIndex = quarter;

                //TODO emmit damage particles & sound
            } else {
                //TODO emmit collision sound
            }
        }
    }

    public update(): boolean {
        return false;
    }
}

export class BlockRigidBody extends RigidBody {
    constructor(o: GameObject, weight: number) {
        super(o, weight);
    }


}