import { Display } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, Sprite, randomIn, randomFloatIn } from "../../engine/utils";
import { Damagable } from "./baseComponents";
import { ParticleCreator } from "../prefabs/basePrefabs";

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
    private particle: ParticleCreator;
    private display: BlockDisplay;

    constructor(o: GameObject, health: number, particle: ParticleCreator, hitSounds: string[] = [], damageSound: string[] = [], destroySound: string[] = []) {
        super(o, health, hitSounds, damageSound, destroySound);
        this.spriteIndex = 0;
        this.display = (o.getDisplay() as any) as BlockDisplay;
        this.particle = particle;
    }

    public setHealth(health: number): void {
        this.health = Math.min(this.maxHealth, health);
        this.display.useSprite(4 - Math.ceil((this.health / (this.maxHealth / 4))))
    }

    public emmitParticles(volume: number, amplitude: number, lifespanMult: number = 1): void {
        const [x, y] = this.object.getPositionXY();
        this.object.getScene().addObject(this.particle(x, y, volume, amplitude, lifespanMult));
    }

    public applyDamage(damage: number): void {
        this.health -= damage;

        if (this.health <= 0) {
            this.emmitParticles(12, 4);
            this.onDestroyed();
        } else {
            // find the quarter to use and update the sprite accordingly 
            const quarter = 4 - Math.ceil((this.health / (this.maxHealth / 4)));
            
            if (this.spriteIndex != quarter) {
                this.display.useSprite(quarter);
                this.spriteIndex = quarter;
                this.emmitParticles(6, 4);
                this.onDamage();
            } else {
                this.onHit();
            }
        }
    }

}