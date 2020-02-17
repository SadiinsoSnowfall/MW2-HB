import { Vec2 } from ".";

export enum Alignment {
    Left,
    Right,
    Centered
}

export enum Style {
    Fill,
    Stroke,
    //FillAndStroke // requires two distinct attributes fill and stroke instead of just color
}

export class TextFormat {
    private font: string;
    private color: string;
    private interline: number;
    private alignment: Alignment;
    private style: Style;

    public static readonly Standard = Object.freeze(new TextFormat("48px sans", 10, Alignment.Centered));

    constructor(font: string, interline: number, alignment: Alignment, color: string = "#000000", style: Style = Style.Fill) {
        this.font = font;
        this.interline = interline;
        this.color = color
        this.alignment = alignment;
        this.style = style;
    }

    public copy(): TextFormat {
        return new TextFormat(this.font, this.interline, this.alignment, this.color, this.style);
    }

    public getFont(): string {
        return this.font;
    }

    public setFont(font: string): void {
        this.font = font;
    }

    public getColor(): string {
        return this.color;
    }

    public setColor(color: string): void {
        this.color = color;
    }

    public getInterline(): number {
        return this.interline;
    }

    public setInterline(interline: number) {
        this.interline = interline;
    }

    public getAlignment(): Alignment {
        return this.alignment;
    }

    public setAlignment(alignment: Alignment) {
        this.alignment = alignment;
    }

    public getStyle(): Style {
        return this.style;
    }

    public setStyle(style: Style): void {
        this.style = style;
    }

    private applyTo(ctx: CanvasRenderingContext2D): void {
        ctx.font = this.font;
        switch (this.style) {
            case Style.Fill:
                ctx.fillStyle = this.color;
                break;

            case Style.Stroke:
                ctx.strokeStyle = this.color;
                break;

            default:
                throw new Error("TextFormat.apply: unknown style");
        }
    }

    private static _measureLine(ctx: CanvasRenderingContext2D, line: string): Vec2 {
        // https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
        let metrics = ctx.measureText(line);
        let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        return new Vec2(metrics.width, actualHeight);
    }

    /**
     * @brief Returns the width and height of the given line if it were drawn on ctx with this format.
     * @param ctx The context to draw on
     * @param line The text to be drawn
     * This function makes use of advanced support of TextMetrics, and is as of now (17/02/2020)
     * the sole reason why Firefox isn't supported.
     */
    public measureLine(ctx: CanvasRenderingContext2D, line: string): Vec2 {
        this.applyTo(ctx);
        return TextFormat._measureLine(ctx, line);
    }

    /**
     * @brief Returns the width and height of several lines if they were drawn on ctx with this format.
     * @param ctx The context to drawn on
     * @param lines Lines to be drawn
     */
    public measureLines(ctx: CanvasRenderingContext2D, lines: string[]): Vec2 {
        this.applyTo(ctx);
        let r = new Vec2(0, 0);
        for (let line of lines) {
            let dim = TextFormat._measureLine(ctx, line);
            r.x = Math.max(r.x, dim.x);
            r.y += dim.y;
        }
        r.y += (lines.length - 1) * this.interline;
        return r;
    }

    /** 
     * @brief Draws text on ctx centered on (0, 0) using this format.
     * @param ctx The context to draw on
     * @param lines Lines to draw
     * @param maxLength Maximum horizontal length of each line; some lines may be squeezed to fit
     * (0, 0) is relative to the current transform. Call ctx.translate() if you want to alter the position.
     */
    public drawText(ctx: CanvasRenderingContext2D, lines: string[], maxLength: number = Infinity): void {
        this.applyTo(ctx);

        // Computing dimensions
        let globalDim = new Vec2(0, 0);
        let lineDim: Vec2[] = [];
        for (let line of lines) {
            let dim = TextFormat._measureLine(ctx, line);
            //console.log(dim.y);
            globalDim.x = Math.max(globalDim.x, dim.x);
            globalDim.y += dim.y;
            lineDim.push(dim);
        }
        globalDim.x = Math.min(globalDim.x, maxLength);
        globalDim.y += (lines.length - 1) * this.interline;

        // Drawing
        let y = -globalDim.y / 2;
        for (let i: number = 0; i < lines.length; i++) {
            let line = lines[i];
            let dim = lineDim[i];
            let x = 0;
            switch (this.alignment) {
                case Alignment.Left:
                    x = -globalDim.x / 2;
                    break;

                case Alignment.Right:
                    x = globalDim.x / 2 - dim.x;
                    break;

                case Alignment.Centered:
                    x = -Math.min(dim.x, maxLength) / 2;
                    break;

                default:
                    throw new Error("TextFormat.drawText: unknown alignment");
            }

            switch (this.style) {
                case Style.Fill:
                    if (maxLength == Infinity) {
                        ctx.fillText(line, x, y);
                    } else {
                        ctx.fillText(line, x, y, maxLength);
                    }
                    break;
                
                case Style.Stroke:
                    if (maxLength == Infinity) {
                        ctx.strokeText(line, x, y);
                    } else {
                        ctx.strokeText(line, x, y, maxLength);
                    }
                    break;

                default:
                     throw new Error("TextFormat.drawText: unknown style");
            }

            y += dim.y + this.interline;
        }
    }

}