import { Display, Behaviour } from "../../engine/components";
import { GameObject } from "../../engine/gameObject";
import { TextFormat, Alignment, Style, Text } from "../../engine/utils/textFormat";
import { Spritesheet, Sprite } from "../../engine/utils/spritesheet";
import { Assets, randomIn, Img } from "../../utils";

export class WigglyBehaviour extends Behaviour {
    public rotation: number;
    public updates: number;
    public last: number;

    private static smooth: number = 8;
    private static variance: number = 5; // Opposite of (variance / 2) actually

    constructor(o: GameObject, rotation: number) {
        super(o);
        this.rotation = rotation;
        this.updates = Math.floor(Math.random() * WigglyBehaviour.smooth);
        this.last = 1;
    }

    public update(): void {
        this.object.scale(1 / this.last, 1/* / this.last*/);
        this.object.rotateRadians(this.rotation);
        let factor = (Math.cos(this.updates / WigglyBehaviour.smooth)) / WigglyBehaviour.variance + 1;
        this.object.scale(factor, /*factor*/1);
        this.last = factor;
        this.updates++;
    }
}

export class WigglyDisplay extends Display {
    public color: string;
    public width: number;
    public height: number;

    constructor(o: GameObject, c: string, w: number, h: number) {
        super(o);
        this.color = c;
        this.width = w;
        this.height = h;
    }

    public update(): void {}

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        // x and y must be 0!
        // The position is implicitly set through the Transform of the object
        // Thus, here x and y don't set the actual offset but rather the offset relative to the center of the object
        // Here we want our object to be the ellipse, so it doesn't make sense to put any value other than 0
        ctx.ellipse(0, 0, this.width, this.height, 0, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

export class SpinnyBehaviour extends Behaviour {
    public rotation: number;

    constructor(o: GameObject, rotation: number) {
        super(o);
        this.rotation = rotation;
        o.scale(2, 0.5);
    }

    public update(): void {
        this.object.rotateRadians(this.rotation);
    }
}

export class SpinnyDisplay extends Display {
    public color: string;
    public radius: number;

    constructor(o: GameObject, c: string, r: number) {
        super(o);
        this.color = c;
        this.radius = r;
    }

    public update(): void {}

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        //ctx.ellipse(0, 0, this.radius, this.radius, 0, 0, 2 * Math.PI);
        ctx.fillRect(-this.radius / 2, -this.radius / 2, this.radius, this.radius);
        ctx.closePath();
    }
}

/*export class FPSMetterDisplay extends Display {
    private format: TextFormat;

    constructor(o: GameObject, a: Alignment, s: Style) {
        super(o);
        this.format = TextFormat.Standard.copy();
        this.format.setAlignment(a);
        this.format.setStyle(s);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        let tick = this.tick() || -1;
        let ftime = this.object?.scene()?.framerate() || -666;
        let rtime = this.object?.scene()?.realFramerate() || -666;
        let frameTxt = `Current frame: ${tick}`;
        let timeTxt = `Frame time: ${ftime.toFixed(2)}ms (${(1000 / ftime).toFixed(1)} fps)`;
        let rtimeTxt = `Real: ${rtime.toFixed(2)}ms (${(1000 / rtime).toFixed(1)} fps)`;
        this.format.drawText(ctx, [frameTxt, timeTxt, rtimeTxt]);
    }
}*/

export class FPSMetterDisplay extends Display {
    private text: Text;

    constructor(o: GameObject, a: Alignment, s: Style) {
        super(o);
        let format = TextFormat.Standard.copy();
        format.setAlignment(a);
        format.setStyle(s);
        this.text = new Text(format, [
            "Current frame: ${0}",
            "Frame time: ${1}ms (${2} fps)\nReal: ${3}ms (${4} fps)"
        ]);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        let tick = this.tick() || -1;
        if (!this.text.isInitialized() || tick % 15 == 0) {
            let ftime = this.object?.scene()?.framerate() || -666;
            let rtime = this.object?.scene()?.realFramerate() || -666;

            this.text.refresh(ctx, [
                tick,
                ftime.toFixed(2),
                (1000 / ftime).toFixed(1),
                rtime.toFixed(2),
                (1000 / rtime).toFixed(1)
            ]);
        }
        this.text.draw(ctx);
    }
}

export class ImageDisplay extends Display {
    private sprite: Sprite;

    constructor(o: GameObject, image: HTMLImageElement) {
        super(o);
        this.sprite = Sprite.fromSource(image);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }
}

export class SpriteDisplay extends Display {
    private sprite: Sprite;

    constructor(o: GameObject, x: number, y: number) {
        super(o);
        let sheet = new Spritesheet(Assets.img(Img.LEVELS_ICON), 4, 3);
        this.sprite = sheet.getSprite(x, y);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.sprite.draw(ctx);
    }
}

export class YoloSpritesheetDisplay extends Display {
    private sheet: Spritesheet;
    private index: number;
    private sprite: Sprite;
    private from: number;
    private to: number;

    constructor(o: GameObject, sheet: Spritesheet, from: number, to: number) {
        super(o);
        this.sheet = sheet;
        this.from = from;
        this.to = to;
        this.index = randomIn(from, to);
        this.sprite = this.sheet.getSpriteAbsolute(this.index);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.tick() % 20 == 0) {
            this.index = ((this.index + 1) % (this.to - this.from + 1)) + this.from;
            this.sprite = this.sheet.getSpriteAbsolute(this.index);
        }
        ctx.scale(2, 2);
        this.sprite.draw(ctx);
    }
}

export class CircleBehaviour extends Display {
    private radius: number;
    private shearFactor: number;

    constructor(o: GameObject, radius: number) {
        super(o);
        this.radius = radius * 2;
        this.shearFactor = 0.01;
    }

    public update(): void {
        let tick = this.tick();
        if (tick % 15 == 0) {
            this.shearFactor *= -1;
        }

        let angle = (2 * Math.PI) / 5;
        //this.object.move(Math.tan(angle) * this.radius, Math.tan(angle) * this.radius);
        //this.object.move(1, 1);
        this.object.translate(this.radius, this.radius);
        
        this.object.rotateDegrees(1);
        this.object.scale(1 + this.shearFactor, 1 - this.shearFactor);
        this.object.shear(this.shearFactor, this.shearFactor);
    }
}