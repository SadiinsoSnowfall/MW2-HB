import { Display } from "../../engine/components/display";
import { GameObject } from "../../engine/gameObject";
import { Assets } from "../../engine/res/assetsManager";
import { screen } from '../../engine/screen'

export class BackgroundDisplay extends Display {
    private imgs: HTMLImageElement[];
    private offset: number;

    constructor(o: GameObject, imgs: string[]) {
        super(o);
        this.imgs = imgs.map(Assets.img); // resolve images
        this.offset = 0;
    }

    public update(): void {
        this.offset += 0.1;
    }

    private fillViewport(ctx: CanvasRenderingContext2D, img: HTMLImageElement, base_x: number, base_y: number) {
        const iw = img.width;

        // fill before
        let cw = base_x;
        while (cw > 0) {
            cw -= iw;
            ctx.drawImage(img, cw, base_y);
        }

        // fill after
        cw = base_x;
        while (cw < screen.width) {
            ctx.drawImage(img, cw, base_y);
            cw += iw;
        }

        return img.height + base_y;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        let rh = 0;

        rh = this.fillViewport(ctx, this.imgs[0], this.offset, rh);
        rh = this.fillViewport(ctx, this.imgs[1], -this.offset, rh);

        ctx.fillStyle = "#64EBE6";
        ctx.fillRect(0, rh, screen.width, 45);

        rh = this.fillViewport(ctx, this.imgs[2], 0, rh + 30);
        ctx.fillStyle = "#EAEE84";
        ctx.fillRect(0, rh, screen.width, screen.height - rh);


        ctx.drawImage(this.imgs[3], 0, 380);
        ctx.drawImage(this.imgs[4], 1200, 300);
    }

}