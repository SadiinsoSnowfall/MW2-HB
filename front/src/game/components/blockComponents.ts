import { Display } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";
import { randomIn, randomFloatIn } from "../../utils";
import { Damagable } from "./baseComponents";
import { ParticleCreator } from "../prefabs/blockPrefabs";
import { Scene } from "../../engine/scene";

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
        const scene = this.object.scene() as Scene; // to bypass the nonnull checks
        const pos = this.object.getPosition();
        scene.addObject(this.particle(pos.x, pos.y, volume, amplitude, lifespanMult));
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

export class ParticleDisplay extends Display {
    private data: number[] = [];
    private delta: number[] = [];

    private sprites: Sprite[] = [];
    private initialLifeSpan: number[] = [];
    private lifespan: number[] = [];

    constructor(o: GameObject, spritesheet: Spritesheet, row: number, maxCol: number, amount: number, amplitude: number, lifespanMult: number = 1) {
        super(o);
        const dataLen = amount * 3; // (x, y, r) * amount
        this.data.length = this.delta.length = dataLen;
        this.lifespan.length = this.initialLifeSpan.length = this.sprites.length = amount;

        this.data.fill(0); // x, y, r initialized to 0 for each
        for (let i = 0; i < dataLen; i += 3) {
            this.delta[i] = randomFloatIn(-amplitude, amplitude);
            this.delta[i + 1] = randomFloatIn(-amplitude, amplitude);
            this.delta[i + 2] = randomFloatIn(-2, 2) * Math.PI / 180; // angle in deg
        }

        for (let i = 0; i < amount; i++) {
            this.sprites[i] = spritesheet.getSprite(randomIn(0, maxCol), row)
            this.lifespan[i] = randomIn(15, 30) * lifespanMult;
            this.initialLifeSpan[i] = this.lifespan[i] / 4; // divided by 4 to smooth out the animation
        }
    }

    public update(delta: number): boolean {
        // update positions
        for (let i = 0; i < this.data.length; ++i) {
            this.data[i] += this.delta[i];
        }

        // update lifespan
        let finished: boolean = true;
        for (let i = 0; i < this.lifespan.length; ++i) {
            if (--this.lifespan[i] > 0) {
                finished = false;
            }
        }

        if (finished) {
            this.object.setEnabled(false);
        }

        return false;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0, j = 0; i < this.sprites.length; ++i, j += 3) {
            if (this.lifespan[i] > 0) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.lifespan[i] / this.initialLifeSpan[i]); // clamp only minimum value
                ctx.translate(this.data[j] | 0, this.data[j + 1] | 0); // convert to integer, ctx operation are way slower when using floats
                ctx.rotate(this.data[j + 2]);
                this.sprites[i].draw(ctx); // draw at (0, 0) instead of (x, y), because of the previous translation
                ctx.restore();
            }
        }
    }

}