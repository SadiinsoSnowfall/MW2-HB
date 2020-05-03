import { Display, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { Spritesheet, pickOneRange, forcePickOneRange } from "../../engine/utils";
import { AudioManager } from "../../engine/res";
import { ParticleCreator } from "../prefabs/basePrefabs";

export class BirdDisplay extends Display {
    protected sheet: Spritesheet;

    constructor(o: GameObject, sheet: Spritesheet) {
        super(o);
        this.sheet = sheet;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sheet.getSpriteAbsolute(0).draw(ctx);
    }
}

const SELECTED: number = 0;
const FLY: number = 1;

export class BaseBirdBehaviour extends Behaviour {
    private particle: ParticleCreator;

    private currentSound: HTMLAudioElement | null = null;
    private touched: boolean = false;

    // select, fly & hit sounds
    private sounds: string[];

    constructor(o: GameObject, baseSounds: string[], particle: ParticleCreator) {
        super(o);
        this.sounds = baseSounds;
        this.particle = particle;
    }

    public emmitParticles(volume: number, amplitude: number, lifespanMult: number = 1): void {
        const [x, y] = this.object.getPositionXY();
        this.object.getScene().addObject(this.particle(x, y, volume, amplitude, lifespanMult));
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
        if (this.touched) {
            this.playSound(forcePickOneRange(this.sounds, 2), .5);
            this.emmitParticles(5, 1.5);
        }
    }

    /**
     * Notify the bird that he's been selected
     */
    public notifySelect(): void {
        this.touched = true;
        this.playSound(this.sounds[SELECTED], .35);
    }

    /**
     * Notify the bird that he's been launched
     */
    public notifyLaunch(): void {
        this.playSound(this.sounds[FLY], .5);
    }

    public isTouched(): boolean {
        return this.touched;
    }

}
