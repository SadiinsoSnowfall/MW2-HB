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

/**
 * @brief A class for formatting and displaying text.
 */
export class TextFormat {
    private font: string;
    private size: number;
    private fontStr: string;
    private color: string;
    private interline: number;
    private alignment: Alignment;
    private style: Style;

    public static readonly Standard = Object.freeze(new TextFormat("sans", 48, 1, Alignment.Left));

    /**
     * @brief Constructs a new TextFormat.
     * @param font Font name.
     * @param size Size, in pixels.
     * @param interline Number of pixels between each line
     * @param alignment Either Left, Right or Centered.
     * @param color Either the fill or stroke color, depending on style.
     * @param style Either Fill or Stroke.
     * Note: size and interline actually translate to pixels in 1:1 only when the Transform used when drawing
     * has no scale or rotation.
     */
    constructor(font: string, size: number, interline: number, alignment: Alignment, color: string = "#000000", style: Style = Style.Fill) {
        this.font = font;
        this.size = size;
        this.fontStr = "";
        this.refreshFontStr();
        this.interline = interline;
        this.color = color
        this.alignment = alignment;
        this.style = style;
    }

    /**
     * @brief Returns a copy of this format.
     */
    public copy(): TextFormat {
        return new TextFormat(this.font, this.size, this.interline, this.alignment, this.color, this.style);
    }

    public getSize(): number {
        return this.size;
    }

    public setSize(size: number): void {
        this.size = size;
        this.refreshFontStr();
    }

    public getFont(): string {
        return this.font;
    }

    public setFont(font: string): void {
        this.font = font;
        this.refreshFontStr();
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

    private refreshFontStr(): void {
        this.fontStr = `${this.size}px ${this.font}`;
    }

    /**
     * @brief Applies the format to ctx.
     * You should not have to call this method yourself:
     * it is automatically performed whenever text is drawn
     */
    public applyTo(ctx: CanvasRenderingContext2D): void {
        ctx.font = this.fontStr;
        switch (this.style) {
            case Style.Fill:
                ctx.fillStyle = this.color;
                break;

            case Style.Stroke:
                ctx.strokeStyle = this.color;
                break;

            default:
                throw new Error("TextFormat#applyTo: unknown style");
        }
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
            let w = ctx.measureText(line).width;
            r.x = Math.max(r.x, w);
        }
        r.y = lines.length * this.size + (lines.length - 1) * this.interline;
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
        let width = 0;
        let lines2: any[] = [];
        for (const line of lines) {
            let w = ctx.measureText(line).width;
            width = Math.max(width, w);
            lines2.push({
                current: line,
                width: w
            });
        }
        width = Math.min(width, maxLength);
        let height = lines.length * this.size + (lines.length - 1) * this.interline;

        // Drawing
        drawText(ctx, this, lines2, width, height, maxLength);
    }
}

// Unexposed function
// lines: array of objects with at least two properties, current (text to display) and width (width of said text)
function drawText(ctx: CanvasRenderingContext2D, format: TextFormat, lines: any[], 
        width: number, height: number, maxLength: number) {

    let y = -height / 2;
    for (const line of lines) {
        let x = 0;
        switch (format.getAlignment()) {
            case Alignment.Left:
                x = -width / 2;
                break;

            case Alignment.Right:
                x = width / 2 - line.width;
                break;

            case Alignment.Centered:
                x = -Math.min(line.width, maxLength) / 2;
                break;

            default:
                throw new Error("TextFormat#drawText: unknown alignment");
        }

        switch (format.getStyle()) {
            case Style.Fill:
                if (maxLength == Infinity) {
                    ctx.fillText(line.current, x, y);
                } else {
                    ctx.fillText(line.current, x, y, maxLength);
                }
                break;
            
            case Style.Stroke:
                if (maxLength == Infinity) {
                    ctx.strokeText(line.current, x, y);
                } else {
                    ctx.strokeText(line.current, x, y, maxLength);
                }
                break;

            default:
                throw new Error("TextFormat#drawText: unknown style");
        }

        y += format.getSize() + format.getInterline();
    }
}

// Unexposed class
class Line {
    private text: string[];
    private variables: number[];
    // since the class is not exposed, it is safe to have public attributes
    public current: string; 
    public width: number;

    constructor(text: string) {
        this.variables = [];
        this.text = [];

        // Looking for variable slots
        let results: RegExpExecArray | null;
        let last = 0;
        while ((results = Text.varRegExp.exec(text)) != null) {
            this.variables.push(parseInt(results[1]));
            this.text.push(text.slice(last, Text.varRegExp.lastIndex - results[0].length));
            last = Text.varRegExp.lastIndex;
        }
        this.text.push(text.slice(last));

        // Dummy values
        this.current = "";
        this.width = -1;
    }

    public refresh(ctx: CanvasRenderingContext2D, variables: any[]): void {
        let current = this.text[0];
        for (let i = 0; i < this.variables.length; i++) {
            current += variables[this.variables[i]].toString() + this.text[i + 1]; 
        }
        if (current != this.current) {
            this.current = current;
            this.width = ctx.measureText(this.current).width;
        }
    }
}

/**
 * @brief A class for text that do not change each frame, vastly more efficient than calling TextFormat#drawText each time.
 * This class defines a concept of variable for parts of the text that can change.
 * The syntax is ${n} where n is an integer. The variable is reset by calling refresh with an array 
 * whose nth element is its new value.
 */
export class Text {
    /**
     * @brief The RegExp used for variables
     */
    public static readonly varRegExp: RegExp = /\$\{([0-9]+)\}/g;

    private format: TextFormat;
    private lines: Line[];
    private maxLength: number;
    private width: number;
    private height: number;
    
    constructor(format: TextFormat, text: string[], maxLength: number = Infinity) {
        // We have to copy since format could change otherwise,
        // and we would need to refresh
        this.format = format.copy();
        this.maxLength = maxLength;

        this.lines = [];
        for (const t of text) {
            // \n are also considered to be separators between lines
            for (const line of t.split(/\n/)) {
                this.lines.push(new Line(line));
            }
        }

        this.width = -1; // Dummy value
        this.height = this.lines.length * format.getSize() + (this.lines.length - 1) * format.getInterline();
    }

    /**
     * @brief Returns whether or not the text has been initialized.
     * If it is not, call refresh.
     * @see refresh
     */
    public isInitialized(): boolean {
        return this.width != -1;
    }

    /**
     * @brief Returns the text that is currently displayed.
     */
    public toString(): string {
        return this.lines.join("\n");
    }

    /**
     * @brief Updates (or initializes) the variables.
     * @param ctx Used for computing text width.
     * @param variables The new values
     */
    public refresh(ctx: CanvasRenderingContext2D, variables: any[]): void {
        this.format.applyTo(ctx);
        this.width = 0;
        for (let line of this.lines) {
            line.refresh(ctx, variables);
            this.width = Math.max(this.width, line.width);
        }
        this.width = Math.min(this.width, this.maxLength);
    }

    /**
     * Draws the text centered on (x, y) (relative to the current transform).
     * @param ctx Used for drawing
     */
    public draw(ctx: CanvasRenderingContext2D): void {
        this.format.applyTo(ctx);
        drawText(ctx, this.format, this.lines, this.width, this.height, this.maxLength);
    }
}