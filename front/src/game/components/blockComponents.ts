import { Display, RigidBody, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";
import { assert, randomIn, range } from "../../utils";
import { Damagable, SSDisplay } from "./baseComponents";
import { Vec2 } from "../../engine/utils";
import { wood_particle, ParticleCreator } from "../prefabs/blockPrefabs";
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
        for (let i = 0; i < volume; i++) {
            scene.addObject(this.particle(pos.x, pos.y, amplitude, lifespanMult));
        }
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

    public update(): boolean {
        return false;
    }
}

export class BlockRigidBody extends RigidBody {
    constructor(o: GameObject, weight: number) {
        super(o, weight);
    }


}

export class ParticleBehaviour extends Behaviour {
    private speedX: number;
    private speedY: number;
    private initialLifeSpan: number;
    private lifespan: number;
    private rotation: number;

    constructor(o: GameObject, amplitude: number, lifespanMult: number = 1) {
        super(o);
        this.speedX = randomIn(-amplitude, amplitude);
        this.speedY = randomIn(-amplitude, amplitude);
        this.lifespan = this.initialLifeSpan = randomIn(15, 30) * lifespanMult;
        this.rotation = randomIn(-2, 2) * Math.PI / 180;
    }

    public update(): boolean {
        if (--this.lifespan <= 0) {
            this.object.setEnabled(false);
        } else {
            (this.object.getDisplay() as SSDisplay).setOpacity(4 * this.lifespan / this.initialLifeSpan);
            this.object.translate(this.speedX, this.speedY);
            this.object.rotateRadians(this.rotation);
        }

        return false;
    }
}