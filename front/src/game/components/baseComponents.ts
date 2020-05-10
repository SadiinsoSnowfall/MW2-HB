import { Display } from "../../engine/components/display";
import { Behaviour } from "../../engine/components/behaviour";
import { GameObject } from "../../engine/gameObject";
import { AudioManager } from "../../engine/res/audioManager";
import { Sprite, Spritesheet } from "../../engine/utils/spritesheet";
import { clamp, pickOne, randomFloatIn, randomIn } from "../../engine/utils/utils";

export class SSDisplay extends Display {
    private sprite: Sprite;
    private opacity: number;

    constructor(o: GameObject, sprite: Sprite, opacity: number = 1) {
        super(o);
        this.sprite = sprite;
        this.opacity = opacity;
    }

    public getOpacity(): number {
        return this.opacity;
    }

    public setOpacity(opacity: number): void {
        this.opacity = clamp(opacity, 0, 1);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = this.opacity;
        this.sprite.draw(ctx);
    }
}

export abstract class Damagable extends Behaviour  {
    protected readonly maxHealth: number;
    protected health: number;

    private hitSounds: string[]
    private damageSounds: string[];
    private destroySonds: string[];

    constructor(o: GameObject, health: number, hitSounds: string[], damageSound: string[], destroySound: string[]) {
        super(o);
        this.maxHealth = this.health = health;
        this.hitSounds = hitSounds;
        this.damageSounds = damageSound;
        this.destroySonds = destroySound;
    }

    public onHit() {
        AudioManager.playIfDefined(pickOne(this.hitSounds), 0.05);
    }

    public onDamage() {
        AudioManager.playIfDefined(pickOne(this.damageSounds), 0.1);
    }

    public onDestroyed() {
        AudioManager.playIfDefined(pickOne(this.destroySonds), 0.20);
        this.object.setEnabled(false); // destroy the object
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public setHealth(health: number): void {
        this.health = health;
    }

    public applyDamage(damage: number): void {
        this.health -= damage;
    }

    public restoreHealth(): void {
        this.health = this.maxHealth;
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

    public update(): void {
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