import { Behaviour, Display } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { pickOne, clamp } from "../../utils";
import { AudioManager } from "../../engine/audioManager";
import { Sprite } from "../../engine/utils";

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