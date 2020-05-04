import { Display, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, pickOneRange, forcePickOneRange, randomFloatIn, randomIn } from "../../engine/utils";
import { AudioManager, Sound } from "../../engine/res";
import { ParticleCreator } from "../prefabs/basePrefabs";

export enum BirdState {
    READY,
    SELECTED,
    FLYING,
    GROUNDED
}

export class BirdDisplay extends Display {
    protected sheet: Spritesheet;
    protected spriteIndex: number;

    protected lastState: BirdState;
    protected animationRemain: number = 0;

    constructor(o: GameObject, sheet: Spritesheet) {
        super(o);
        this.sheet = sheet;
        this.spriteIndex = 0;
        this.lastState = BirdState.READY;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sheet.getSpriteAbsolute(this.spriteIndex).draw(ctx);
    }
    
}

// for red and yellow birds
export class RedBirdDisplay extends BirdDisplay {
    constructor(o: GameObject, sheet: Spritesheet) {
        super(o, sheet);
    }

    public update(): void {
        const bb = this.object.fgetBehaviour<BaseBirdBehaviour>();
        const state = bb.getState();

        if (state !== this.lastState) {
            this.lastState = state;
            switch (state) {
                case BirdState.FLYING:
                    this.spriteIndex = 1;
                break;

                case BirdState.GROUNDED:
                    this.spriteIndex = 3;
                break;
            }
        } else if (state == BirdState.READY) {
            if (this.animationRemain > 0) {
                if (--this.animationRemain === 0) {
                    this.spriteIndex = 0;
                }
            } else {
                if (Math.random() > 0.997) {
                    this.animationRemain = randomIn(60, 120);
                    this.spriteIndex = 1;
                }
            }
        }
    }
}

// for blue, black and white birds
export class BlueBirdDisplay extends BirdDisplay {
    constructor(o: GameObject, sheet: Spritesheet) {
        super(o, sheet);
    }

    public update(): void {
        const bb = this.object.fgetBehaviour<BaseBirdBehaviour>();
        const state = bb.getState();

        if (state !== this.lastState) {
            this.lastState = state;
            switch (state) {
                case BirdState.FLYING:
                    this.spriteIndex = 2;
                break;

                case BirdState.GROUNDED:
                    this.spriteIndex = 3;
                break;
            }
        } else if (state == BirdState.READY) {
            if (this.animationRemain > 0) {
                if (--this.animationRemain === 0) {
                    this.spriteIndex = 0;
                }
            } else {
                if (Math.random() > 0.997) {
                    this.animationRemain = randomIn(60, 120);
                    this.spriteIndex = 1;
                }
            }
        }
    }
}

export class GreenBirdDisplay extends BirdDisplay {
    constructor(o: GameObject, sheet: Spritesheet) {
        super(o, sheet);
    }

    public update(): void {
        const bb = this.object.fgetBehaviour<BaseBirdBehaviour>();
        const state = bb.getState();

        if (state !== this.lastState) {
            this.lastState = state;
            switch (state) {
                case BirdState.FLYING:
                    this.spriteIndex = 2;
                break;

                case BirdState.GROUNDED:
                    this.spriteIndex = 4;
                break;
            }
        } else if (state == BirdState.READY) {
            if (this.animationRemain > 0) {
                if (--this.animationRemain === 0) {
                    this.spriteIndex = 0;
                }
            } else {
                if (Math.random() > 0.997) {
                    this.animationRemain = randomIn(60, 120);
                    this.spriteIndex = 1;
                }
            }
        }
    }
}

// for big bird
export class BigBirdDisplay extends BirdDisplay {
    constructor(o: GameObject, sheet: Spritesheet) {
        super(o, sheet);
    }

    public update(): void {
        const bb = this.object.fgetBehaviour<BaseBirdBehaviour>();
        const state = bb.getState();

        if (state !== this.lastState) {
            this.lastState = state;
            switch (state) {
                case BirdState.FLYING:
                    this.spriteIndex = 1;
                break;

                case BirdState.GROUNDED:
                    this.spriteIndex = 2;
                break;
            }
        } else if (state == BirdState.READY) {
            if (this.animationRemain > 0) {
                if (--this.animationRemain === 0) {
                    this.spriteIndex = 0;
                }
            } else {
                if (Math.random() > 0.997) {
                    this.animationRemain = randomIn(60, 120);
                    this.spriteIndex = 1;
                }
            }
        }
    }

}

const SELECTED: number = 0;
const FLY: number = 1;

export class BaseBirdBehaviour extends Behaviour {
    private feathers: ParticleCreator;
    private smoke: ParticleCreator;

    private currentSound: HTMLAudioElement | null = null;
    private state: BirdState;

    // select, fly & hit sounds
    private sounds: string[];
    private lifespan: number = 400;

    constructor(o: GameObject, baseSounds: string[], feathers: ParticleCreator, smoke: ParticleCreator) {
        super(o);
        this.state = BirdState.READY;
        this.sounds = baseSounds;
        this.feathers = feathers;
        this.smoke = smoke;
    }

    public update(): void {
        if (this.state === BirdState.GROUNDED) {
            if (--this.lifespan <= 0) {
                this.playSound(Sound.BIRD_DESTROYED, .4);
                this.emmitParticles(this.feathers, 20, 2);
                this.emmitParticles(this.smoke, 5, 1.25);
                this.object.setEnabled(false);
            }
        }
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

    public onCollide(): void {
        if (this.state === BirdState.FLYING) {
            this.state = BirdState.GROUNDED;
            this.playSound(forcePickOneRange(this.sounds, 2), .5);
            this.emmitParticles(this.feathers, 5, 1.5);
        }
    }

    /**
     * Notify the bird that he's been selected
     */
    public notifySelect(): void {
        this.state = BirdState.SELECTED;
        this.playSound(this.sounds[SELECTED], .35);
    }

    /**
     * Notify the bird that he's been launched
     */
    public notifyLaunch(): void {
        this.state = BirdState.FLYING;
        this.playSound(this.sounds[FLY], .5);
    }

    public getState(): BirdState {
        return this.state;
    }

}
