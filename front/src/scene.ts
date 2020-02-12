export class Scene {
    constructor() {}

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.clearRect(0, 0, 1000, 1000);
        ctx.beginPath();
        ctx.ellipse(100, 100, 50, 75, 45 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fillStyle = "#008000";
        ctx.fill();
    }
}