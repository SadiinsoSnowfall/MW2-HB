/**
 * @brief Defines any object that can interact with the game loop.
 */
export interface Scene {
    /**
     * @brief Displays this Scene on a canvas.
     * @param ctx The context from the canvas the scene must be drawn on.
     */
    draw(ctx: CanvasRenderingContext2D): void;

    /**
     * @brief Updates the game without displaying it.
     * @returns The next scene to update and display (usually, itself)
     */
    update(): Scene;
}

/**
 * @brief A dull implementation of Scene for the sole purpose of testing.
 */
export class DullScene implements Scene {
    constructor() {}

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.ellipse(100, 100, 50, 75, 45 * Math.PI/180, 0, 2 * Math.PI);
        ctx.fillStyle = "#008000";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(200, 200, 500, 2);
        ctx.fillStyle = "#800000";
        ctx.fill();
        ctx.closePath();
    }

    public update(): Scene {
        return this;
    }
}