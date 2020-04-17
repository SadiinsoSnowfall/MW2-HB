import { Vec2, Transform } from "../utils";
import { Rectangle } from ".";

/**
 * @brief A class used by Shape to generate contact points.
 * This class is only meant to be instanciated by Shape#feature.
 * @see Shape#feature
 */
export class Edge {
    private maxVertex: Vec2;
    private a: Vec2;
    private b: Vec2;
    private ab: Vec2;

    /**
     * @brief Constructor.
     * @param maxVertex The support point of the shape for the parameter d of Shape#feature
     * @param a One of the end of the edge
     * @param b The other end
     * As usual, the winding is counter-clockwise. Either a or b should be maxVertex.
     */
    constructor(maxVertex: Vec2, a: Vec2, b: Vec2) {
        this.maxVertex = maxVertex;
        this.a = a;
        this.b = b;
        this.ab = Vec2.sub(b, a);
    }

    /**
     * @brief Returns the point that was farthest along the parameter of Shape#feature.
     */
    public getMaxVertex(): Vec2 {
        return this.maxVertex;
    }

    /**
     * @brief Returns the first end of the edge.
     */
    public getA(): Vec2 {
        return this.a;
    }

    /**
     * @brief Returns the last end of the edge.
     */
    public getB(): Vec2 {
        return this.b;
    }

    /**
     * @brief Returns the vector AB.
     */
    public getVector(): Vec2 {
        return this.ab;
    }
}

/**
 * @brief Interface for all classes that can be used as shapes.
 */
export interface Shape {
    /**
     * @brief Returns whether or not point belongs in the shape.
     */
    pointIn(point: Vec2): boolean;

    /**
     * @brief Returns the smallest AABB that contains the entire shape.
     */
    boundingBox(): Rectangle;

    /**
     * @brief Performs the transformation of a shape.
     */
    transform(t: Transform): Shape;

    /**
     * @brief Returns the point that has the highest dot product with d.
     * Geometrically, such a point is the farthest in the direction of d.
     */
    support(d: Vec2): Vec2;

    /**
     * @brief Returns the feature that is farthest in the direction of d.
     * For curved shapes, the result from support is enough.
     * For shapes with edges, an edge should be returned (how surprising).
     * http://www.dyn4j.org/2011/11/contact-points-using-clipping/
     */
    feature(d: Vec2): Edge | Vec2;

    /**
     * @brief Returns an arbitraty point on the boundary of the shape.
     */
    pick(): Vec2;

    /**
     * @brief Draws the boundary of the shape.
     * This method should only be called by objects which have already set the right Transform.
     */
    stroke(ctx: CanvasRenderingContext2D): void;

    /**
     * Draws the interior of the shape.
     * Like stroke(), this method should only be called by objets which have already set the right Transform.
     * @param ctx The context to draw on
     * @param color The color to be used
     */
    fill(ctx: CanvasRenderingContext2D, color: string): void;
}

/**
 * @brief Can be used by subclasses to draw their center.
 */
export function drawCross(ctx: CanvasRenderingContext2D, dot: Vec2, color: string = "#000000"): void {
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(dot.x, dot.y - 5);
    ctx.lineTo(dot.x, dot.y + 5);
    ctx.moveTo(dot.x - 5, dot.y);
    ctx.lineTo(dot.x + 5, dot.y);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}