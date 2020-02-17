import { Vec2 } from "./vec2";
export * from "./vec2";

/**
 * @brief A 2D transformation matrix supporting translations.
 * All methods return a new value ; the old one is not modified.
 * 
 * Initially, Transform was a subclass for DOMMatrix, but we then remade it from scratch
 * since the documentation seemed to suggest slight differences between navigators
 * (see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix/DOMMatrix).
 */
export class Transform {
    public static readonly Identity = new Transform(1, 0, 0, 1, 0, 0);

    private readonly m11: number;
    private readonly m12: number;
    private readonly m21: number;
    private readonly m22: number;
    private readonly m31: number;
    private readonly m32: number;

    /**
     * @brief Constructor.
     * The resulting matrix will have the following values :
     * a c e
     * b d f
     * 0 0 1
     */
    constructor(a: number, b : number, c: number, d: number, e: number, f: number) {
        this.m11 = a;
        this.m12 = b;
        this.m21 = c;
        this.m22 = d;
        this.m31 = e;
        this.m32 = f;
    }

    /**********************************************************************************************
     * 
     * Static functions
     * 
     *********************************************************************************************/

    public static degreesToRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }

    public static radiansToDegrees(radians: number): number {
        return (radians * 180) / Math.PI;
    }

    /**********************************************************************************************
     * 
     * Getters
     * 
     *********************************************************************************************/

    /**
     * @brief Applies the transform to the context.
     */
    public applyToContext(ctx: CanvasRenderingContext2D): void {
        // setTransform is better suited if we do not want to handle sub-objects ;
        // otherwise transform allows us to combine this transform with the parent's
        // (see GameObject.draw)
        //ctx.setTransform(this.m11, this.m12, this.m21, this.m22, this.m31, this.m32);
        ctx.transform(this.m11, this.m12, this.m21, this.m22, this.m31, this.m32);
    }

    /**
     * @brief Returns the current translation.
     */
    public getTranslation(): Vec2 {
        return new Vec2(this.m31, this.m32);
    }

    /**
     * @brief Returns the current scale.
     */
    public getScale(): Vec2 {
        return new Vec2(
            Vec2.magnitude(this.m11, this.m12), 
            Vec2.magnitude(this.m21, this.m22)
        );
    }

    /**
     * @brief Returns the current rotation, in radians.
     */
    public getRotation(): number {
        let scaleX = Vec2.magnitude(this.m11, this.m12);
        let angle = Math.acos(this.m11 / scaleX); // acos(cos(angle))
        if (Math.sign(this.m12 / scaleX) < 0) {   // sign(sin(angle)) < 0
            return angle;
        } else {
            return -angle;
        }
    }

    public toString(): string {
        return this.m11 + " " + this.m21 + " " + this.m31 + "\n"
            + this.m12 + " " + this.m22 + " " + this.m32 + "\n0 0 1";
    }

    /**********************************************************************************************
     * 
     * Arithmetic
     * 
     *********************************************************************************************/

    /**
     * Multiplies this matrix by another one.
     * @param m The other matrix.
     */
    public multiplyMatrix(m: Transform): Transform {
        return new Transform(
            this.m11 * m.m11 + this.m21 * m.m12,
            this.m12 * m.m11 + this.m22 * m.m12,
            this.m11 * m.m21 + this.m21 * m.m22,
            this.m12 * m.m21 + this.m22 * m.m22,
            this.m11 * m.m31 + this.m21 * m.m32 + this.m31,
            this.m12 * m.m31 + this.m22 * m.m32 + this.m32
        );
    }

    /**
     * Returns a vector v' such that this * v = v'.
     */
    public multiplyVector(v: Vec2): Vec2 {
        return new Vec2(
            this.m11 * v.x + this.m21 * v.y + this.m31,
            this.m12 * v.x + this.m22 * v.y + this.m32
        );
    }

    /**********************************************************************************************
     * 
     * Transformations
     * 
     *********************************************************************************************/

    /**
     * @brief Moves the matrix alongside the vector (x, y). 
     */
    public translate(x: number, y: number): Transform {
        return new Transform(
            this.m11,
            this.m12,
            this.m21,
            this.m22,
            this.m11 * x + this.m21 * y + this.m31,
            this.m12 * x + this.m22 * y + this.m32
        );
    }

    /**
     * @brief Centers the matrix around (x, y) relative to the current state.
     */
    public center(x: number, y: number): Transform {
        return this.translate(x, y);
    }

    /**
     * Scales the matrix.
     * @param x Factor alongside the x axis
     * @param y Factor alongside the y axis
     */
    public scale(x: number, y: number): Transform {
        return new Transform(
            this.m11 * x,
            this.m12 * x, 
            this.m21 * y,
            this.m22 * y,
            this.m31,
            this.m32
        );
    }

    /**
     * Rotates the matrix.
     * @param angle The angle in radians
     * @see rotateDegrees, radiansToDegrees
     */
    public rotateRadians(angle: number): Transform {
        let cosa = Math.cos(angle);
        let sina = Math.sin(angle);
        return new Transform(
            this.m11 * cosa - this.m21 * sina,
            this.m12 * cosa - this.m22 * sina,
            this.m11 * sina + this.m21 * cosa,
            this.m12 * sina + this.m22 * cosa,
            this.m31,
            this.m32
        );
    }

    /** 
     * Rotates the matrix.
     * @param angle The angle, in degrees
     * @see rotateRadians, degreesToRadians
     */
    public rotateDegrees(angle: number): Transform {
        return this.rotateRadians(Transform.degreesToRadians(angle));
    }
}