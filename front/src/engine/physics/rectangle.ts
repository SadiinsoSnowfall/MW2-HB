import { Vec2, assert } from "../utils";

/**
 * @brief Class for axis-aligned bounding boxes.
 * Though Rectangle is conceptually a Shape, 
 * it should not be used by GameObjects directly since it does not support rotation,
 * so it does not implement the interface.
 */
export class Rectangle {
    public readonly position: Vec2;
    public readonly width: number;
    public readonly height: number;

    /**
     * @brief Returns the smallest rectangle that contains all given points.
     * @param points A non-empty list of points
     */
    public static bound(points: Vec2[]): Rectangle {
        assert(points.length >= 1, "Rectangle#bound: points is empty");

        let xmax = points[0].x;
        let xmin = xmax;
        let ymax = points[0].y;
        let ymin = ymax;
        for (const p of points) {
            if (p.x < xmin) {
                xmin = p.x;
            } else if (p.x > xmax) {
                xmax = p.x;
            }

            if (p.y < ymin) {
                ymin = p.y;
            } else if (p.y > ymax) {
                ymax = p.y;
            }
        }

        return new Rectangle(
            new Vec2(xmin, ymin),
            xmax - xmin,
            ymax - ymin
        );
    }

    constructor(position: Vec2, width: number, height: number) {
        assert(width >= 0 && height >= 0, `Rectangle#constructor: invalid dimensions (${width}, ${height})`);
        this.position = position;
        this.width = width;
        this.height = height;
    }

    /**
     * @brief Returns a string representation of this AABB.
     */
    public toString(): string {
        return `{x: ${this.position.x}, y: ${this.position.y}, width: ${this.width}, height: ${this.height}}`;
    }

    /**
     * @brief Returns whether or not point is in the AABB.
     */
    public pointIn(point: Vec2): boolean {
        return (point.x >= this.position.x && point.x <= this.position.x + this.width)
            && (point.y >= this.position.y && point.y <= this.position.y + this.height);
    }

    /**
     * @brief Returns whether or not this rectangle intersects with rect.
     */
    public intersects(rect: Rectangle): boolean {
        return (this.position.x <= rect.position.x + rect.width  && this.position.x + this.width  >= rect.position.x)
            && (this.position.y <= rect.position.y + rect.height && this.position.y + this.height >= rect.position.y);
    }

    /**
     * @brief Returns true if rect is completely enclosed inside this rectangle.
     */
    public encloses(rect: Rectangle): boolean {
        return (this.position.x <= rect.position.x && this.position.x + this.width  >= rect.position.x + rect.width)
            && (this.position.y <= rect.position.y && this.position.y + this.height >= rect.position.y + rect.height);
    }

    /**
     * @brief Returns the bounding box that encompasses this and rect.
     */
    public merge(rect: Rectangle): Rectangle {
		let tr = this.position.x + this.width;
		let tb = this.position.y + this.height;
		let rr = rect.position.x + rect.width;
		let rb = rect.position.y + rect.height;
		
		let l = Math.min(rect.position.x, this.position.x);
		let r = Math.max(rr, tr);
		let t = Math.min(rect.position.y, this.position.y);
		let b = Math.max(rb, tb);
		return new Rectangle(new Vec2(l, t), r - l, b - t);
    }
    
    /**
     * @brief Returns an AABB that is slightly larger than this one.
     * The result will have the same center.
     */
    public fatten(factor: number): Rectangle {
        let w = this.width * factor;
        let h = this.height * factor;
        return new Rectangle(
            new Vec2(
                this.position.x + this.width  / 2 - w / 2,
                this.position.y + this.height / 2 - h / 2
            ),
            w, h
        );
    }

    /**
     * @brief Returns the area of this rectangle.
     */
    public area(): number {
        return this.width * this.height;
    }

    /**
     * @brief Computes the area of the minimal AABB enclosing this and rect.
     * The minimal AABB is actually not computed.
     */
    public mergedArea(rect: Rectangle): number {
        let tr = this.position.x + this.width;
		let tb = this.position.y + this.height;
		let rr = rect.position.x + rect.width;
		let rb = rect.position.y + rect.height;
		let l = Math.min(rect.position.x, this.position.x);
		let r = Math.max(rr, tr);
		let t = Math.min(rect.position.y, this.position.y);
		let b = Math.max(rb, tb);
        return (r - l) * (b - t);
    }

    /**
     * @brief Draws the bounding box (for debug purpose).
     * Unlike regular shapes, ctx's transform will be reset:
     * the coordinates are absolute.
     */
    public draw(ctx: CanvasRenderingContext2D) {
        ctx.resetTransform();
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.stroke();
        ctx.closePath();
    }
} 
