import { Display } from "../../engine/components/display";
import { forcePickOne, randomIn } from "../../engine/utils/utils";
import { GameObject } from "../../engine/gameObject";
import { Damagable } from "./baseComponents";
import { ParticleCreator } from "../prefabs/basePrefabs";
import { AudioManager } from "../../engine/res/audioManager";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";

export interface AnimationData {
    data: [number, number][];
    repeat: number;
    final: number;
}

export type AnimationGenerator = () => AnimationData;

const talk_animation_1: AnimationData = {
    data: [
        [3, 7],
        [4, 7]
    ],
    repeat: 4,
    final: 0
};

const talk_animation_2: AnimationData = {
    data: [
        [1, 7],
        [0, 7]
    ],
    repeat: 4,
    final: 0
};

const talk_animations: AnimationData[] = [
    talk_animation_1,
    talk_animation_2
];

const blink_animation: AnimationData = {
    data: [
        [2, 13],
    ],
    repeat: 0,
    final: 0
};

const sleep_animation: AnimationData = {
    data: [
        [8, 40],
        [9, 40],
    ],
    repeat: 3,
    final: 0
};

const smile_animation: AnimationGenerator = () => ({
    data: [
        [forcePickOne([5, 6]), 100],
    ],
    repeat: 0,
    final: 0
});

const blink_damaged_animation: AnimationData = {
    data: [
        [16, 13],
    ],
    repeat: 0,
    final: 15
};

const talk_animation_damaged: AnimationData = {
    data: [
        [17, 7],
        [18, 7]
    ],
    repeat: 4,
    final: 15
};

const blink_damaged_animation_2: AnimationData = {
    data: [
        [20, 13],
    ],
    repeat: 0,
    final: 19
};

const talk_animation_damaged_2: AnimationData = {
    data: [
        [21, 7],
        [22, 7]
    ],
    repeat: 4,
    final: 19
};

export class PigDisplay extends Display {
    private sheet: Spritesheet;
    private sprite: Sprite;

    private ca: AnimationData | null = null;
    private caRepeat: number = 0;
    private caFrame: number = 0;
    private caSubFrame: number = 0;

    constructor(o: GameObject, sheet: Spritesheet) {
        super(o);
        this.sheet = sheet;
        this.sprite = sheet.getSpriteAbsolute(0);
    }

    public playAnimation(anim: AnimationData): void {
        this.ca = anim;
        this.caFrame = this.caSubFrame = this.caRepeat = 0;
        this.useSprite(this.ca.data[0][0]);
    }

    public useSprite(id: number): void {
        this.sprite = this.sheet.getSpriteAbsolute(id);
    }

    public stopAnimation(): void {
        this.ca = null;
    }

    public update(): void {
        if (this.ca !== null) {
            ++this.caSubFrame;
            if (this.caSubFrame >= this.ca.data[this.caFrame][1]) {
                this.caSubFrame = 0;
                ++this.caFrame;
                if (this.caFrame >= this.ca.data.length) {
                    ++this.caRepeat;
                    if (this.caRepeat >= this.ca.repeat) {
                        this.useSprite(this.ca.final);
                        this.ca = null;
                    } else {
                        this.caSubFrame = this.caFrame = 0;
                        this.useSprite(this.ca.data[0][0]);
                    }
                } else {
                    this.useSprite(this.ca.data[this.caFrame][0]);
                }
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }
}

export class PigBehaviour extends Damagable {
    private currentSound: HTMLAudioElement | null = null;
    private talkSounds: string[];
    private pd: PigDisplay;
    private seed: number;
    private smoke: ParticleCreator;
    private damageLevel: number;

    constructor(o: GameObject, health: number, smoke: ParticleCreator, talkSounds: string[], hitSounds: string[], damageSound: string[], destroySound: string[]) {
        super(o, health, hitSounds, damageSound, destroySound);
        this.pd = this.object.fgetDisplay<PigDisplay>();
        this.talkSounds = talkSounds;
        this.seed = randomIn(0, 150);
        this.smoke = smoke;
        this.damageLevel = 0;
    }

    public emmitParticles(particle: ParticleCreator, volume: number, amplitude: number, lifespanMult: number = 1): void {
        const [x, y] = this.object.getPositionXY();
        this.object.getScene().addObject(particle(x, y, volume, amplitude, lifespanMult));
    }

    /**
     * Sound player abstraction to prevent playing two sounds at the same time
     */
    private async playSound(sound: string, volume: number): Promise<void> {
        if (this.currentSound !== null) {
            this.currentSound.pause();
            this.currentSound = null;
        }

        this.currentSound = await AudioManager.play(sound, volume);
    }

    private animationDamagelevel0(tick: number): void {
        if (tick % 200 == 0) {
            if (Math.random() > 0.85) {
                this.pd.playAnimation(forcePickOne(talk_animations));
                this.playSound(forcePickOne(this.talkSounds), .4);
            } else if (Math.random() > 0.5) {
                this.pd.playAnimation(blink_animation);
            } else if (Math.random() > 0.85) {
                this.pd.playAnimation(sleep_animation);
            } else if (Math.random() > 0.5) {
                this.pd.playAnimation(smile_animation());
            }
        }
    }

    private animationDamagelevel2(tick: number): void {
        if (tick % 200 == 0) {
            if (Math.random() > 0.85) {
                this.pd.playAnimation(talk_animation_damaged);
                this.playSound(forcePickOne(this.talkSounds), .4);
            } else if (Math.random() > 0.5) {
                this.pd.playAnimation(blink_damaged_animation);
            } else if (Math.random() > 0.85) {
                
            }
        }
    }

    private animationDamagelevel3(tick: number): void {
        if (tick % 200 == 0) {
            if (Math.random() > 0.85) {
                this.pd.playAnimation(talk_animation_damaged_2);
                this.playSound(forcePickOne(this.talkSounds), .4);
            } else if (Math.random() > 0.5) {
                this.pd.playAnimation(blink_damaged_animation_2);
            } else if (Math.random() > 0.85) {
                
            }
        }
    }

    public update(): void {
        const tick = this.tick() + this.seed;

        if (this.damageLevel <= 1) {
            this.animationDamagelevel0(tick);
        } else if (this.damageLevel == 2) {
            this.animationDamagelevel2(tick);
        } else {
            this.animationDamagelevel3(tick);
        }
    }

    public applyDamage(damage: number): void {
        this.health -= damage;

        if (this.health <= 0) {
            this.emmitParticles(this.smoke, 5, 1);
            this.onDestroyed();
        } else {
            // find the quarter to use and update the sprite accordingly 
            const quarter = 4 - Math.ceil((this.health / (this.maxHealth / 4)));
            this.pd.stopAnimation();

            if (this.damageLevel != quarter) {
                this.damageLevel = quarter;

                if (this.damageLevel > 2) {
                    this.pd.useSprite(19);
                } else if (this.damageLevel > 1) {
                    this.pd.useSprite(15)
                }

                this.onDamage();
            } else {
                this.onHit();
            }
        }
    }

    public onCollide(force: number): void {
        if (force >= 10) {
            this.applyDamage(force);
        }
    }

}