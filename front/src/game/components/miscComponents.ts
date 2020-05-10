import { GameObject } from "../../engine/gameObject";
import { Scene, MOBYDICK } from "../../engine/scene";
import { BirdPrefabs } from "../prefabs/birdPrefabs";
import { RigidBody } from "../../engine/components/rigidBody";
import { BaseBirdBehaviour, BirdState } from "./birdComponents";
import { Img, Sound } from "../../engine/res/assetsManager";
import { AudioManager } from "../../engine/res/audioManager";
import { Sprite, SSManager } from "../../engine/utils/spritesheet";
import { Vec2 } from "../../engine/utils/vec2";
import { inRect, forcePickOne } from "../../engine/utils/utils";
import { Display } from "../../engine/components/display";
import { Behaviour } from "../../engine/components/behaviour";
import { PigPrefabs } from "../prefabs/pigPrefabs";
import * as Menus from '../ui/basemenus';


const startSound: string[] = [
    Sound.LEVEL_START_1,
    Sound.LEVEL_START_2,
];

const winSounds: string[] = [
    Sound.LEVEL_CLEAR_1,
    Sound.LEVEL_CLEAR_2,
];

const looseSounds: string[] = [
    Sound.LEVEL_FAILED_1,
    Sound.LEVEL_FAILED_2,
];

export class SlingshotDisplay extends Display {
    private s_neutral: Sprite;
    private s_base: Sprite;
    private s_arm: Sprite;

    private dp: [number, number] | null = null;

    constructor(o: GameObject) {
        super(o);
        const sheet = SSManager.get(Img.MISC_XLV, 5, 2);
        this.s_neutral = sheet.getSprite(0, 0);
        this.s_base = sheet.getSprite(1, 0);
        this.s_arm = sheet.getSprite(2, 0);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.dp) {
            const [x, y] = this.object.getPositionXY();
            const [dx, dy] = this.dp;
            const px = dx - x;
            const py = dy - y;

            // draw stuff
            ctx.strokeStyle = ctx.fillStyle = "#54270F";
            ctx.fillRect(px - 10, py - 10, 20, 20);
            ctx.lineWidth = 15;

            // first line
            ctx.strokeStyle = ctx.fillStyle = "#301608";
            ctx.beginPath();
            ctx.moveTo(25, -65);
            ctx.lineTo(px, py);
            ctx.stroke();

            this.s_neutral.draw(ctx, -2, 1);

            // second line
            ctx.strokeStyle = ctx.fillStyle = "#54270F";
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(-10, -60);
            ctx.stroke();
        } else {
            // draw first part
            this.s_base.draw(ctx, 30, 0);

            // draw second part
            this.s_arm.draw(ctx, 3, -42);
        }
    }

    public setDragPoint(p: [number, number] | null): void {
        this.dp = p;
    }

}

export class SlingshotBehaviour extends Behaviour {
    // sqared max distance to avoir math.sqrt calls
    private static readonly maxStretch: number = 150;
    private static readonly maxStretchSqr: number = Math.pow(SlingshotBehaviour.maxStretch, 2);

    private gameEnded: boolean = false;

    private sd: SlingshotDisplay;
    private clickBegin: Vec2 | null = null;
    private bird: RigidBody | undefined = undefined;

    private playingSound: HTMLAudioElement | null = null;

    constructor(o: GameObject) {
        super(o);
        this.sd = o.fgetDisplay<SlingshotDisplay>();
        this.setClickable();
    }

    public getSLPosXY(): [number, number] {
        let pos = this.object.getPositionXY();
        pos[0] += 15;
        pos[1] -= 55;
        return pos;
    }

    private updateCheck(): void {
        const scene = this.object.getScene() as Scene;
        const birds = scene.queryAll({
            from: MOBYDICK,
            where: obj => BirdPrefabs.isBird(obj)
        });

        const pigs = scene.queryAll({
            from: MOBYDICK,
            where: obj => PigPrefabs.isPig(obj)
        });

        if (pigs.length == 0) { // win
            AudioManager.play(forcePickOne(winSounds));
            Menus.win_menu.setVisible(true);
            this.gameEnded = true;
        } else if (birds.length == 0) { // lose
            AudioManager.play(forcePickOne(looseSounds));
            Menus.lose_menu.setVisible(true);
            this.gameEnded = true;
        }


    }

    public update(): void {
        if (!this.gameEnded) {
            this.updateCheck();
        }

        if (this.bird === undefined) {
           this.autoPickBird();
        } else if (this.clickBegin === null) {
            const [x, y] = this.getSLPosXY();
            const [bx, by] = this.bird.object.getPositionXY();
            const dx = (x - bx) / 10;
            const dy = (y - by) / 10;

            if ((dx != 0) || (dy != 0)) {
                this.bird.object.translate(dx, dy);
            }
        }
    }

    public autoPickBird() {
        const scene = this.object.getScene() as Scene;
        this.pickBird(scene.query({
            from: MOBYDICK,
            where: obj => BirdPrefabs.isBird(obj) && (obj.fgetBehaviour<BaseBirdBehaviour>().getState() === BirdState.READY)
        }));
    }

    public pickBird(bird: GameObject | undefined | null) {
        if (bird) {
            this.bird = bird.fgetCollider<RigidBody>();
            this.bird.setCoEnabled(false);
            bird.fgetBehaviour<BaseBirdBehaviour>().notifySelect();
        }
    }

    public isInside(p: Vec2): boolean {
        const [x, y] = this.object.getPositionXY();
        return inRect(p.x, p.y, x - 50, y - 100, 100, 200);
    }

    private async doSound(): Promise<void> {
        if (this.playingSound === null || this.playingSound.ended) {
            this.playingSound = await AudioManager.play(Sound.SLINGSHOT, .25);
        }
    }

    public onMouseMove(p: Vec2): void {
        if (this.clickBegin) {
            this.doSound();

            let [dpx, dpy] = p.XY(); // clone vec2 data
            const [x, y] = this.getSLPosXY();
            const dist = Vec2.sqrDistanceXY(x, y, dpx, dpy);

            if (dist >= SlingshotBehaviour.maxStretchSqr) {
                const dr = SlingshotBehaviour.maxStretch / Math.sqrt(dist);
                const idr = 1 - dr;
                dpx = idr * x + dr * dpx;
                dpy = idr * y + dr * dpy;
            }

            this.sd.setDragPoint([dpx, dpy]);
            if (this.bird) {
                this.bird.object.place(dpx, dpy);
            }
        }
    }

    public onMouseDown(p: Vec2): void {
        if (this.bird) {
            this.clickBegin = p.clone();
        }
    }

    public onMouseUp(p: Vec2): void {
        this.clickBegin = null;
        this.sd.setDragPoint(null);

        if (this.playingSound) {
            this.playingSound.pause();
            this.playingSound = null;
        }

        if (this.bird) {
            const [x, y] = this.getSLPosXY();
            const [bx, by] = this.bird.object.getPositionXY();
            const bird = this.bird;

            // cancel launch if distance is two short
            if (Vec2.distanceXY(x, y, bx, by) > 50) {
                // set bird touched & resume physics
                bird.object.fgetBehaviour<BaseBirdBehaviour>().notifyLaunch();
                bird.setCoEnabled(true);

                // apply force
                bird.applyForceXY(700 * (x - bx), 800 * (y - by));

                // detach bird
                this.bird = undefined;
            }
        }
    }

}