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

    private m11: number;
    private m12: number;
    private m21: number;
    private m22: number;
    private m31: number;
    private m32: number;

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

    /**
     * @brief Returns the same angle expressed in radians.
     */
    public static degreesToRadians(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }

    /**
     * @brief Returns the same angle expressed in degrees.
     */
    public static radiansToDegrees(radians: number): number {
        return (radians * 180) / Math.PI;
    }

    /**
     * @brief Returns the translation matrix for (x, y)
     */
    public static translationMatrix(x: number, y: number) {
        return new Transform(
            1, 0, 0, 1, x, y
        );
    }

    /**
     * @brief Returns the scale matrix for horizontal factor x and vertical factor y
     */
    public static scaleMatrix(x: number, y: number): Transform {
        return new Transform(
            x, 0, 0, y, 0, 0
        );
    }

    /**
     * @brief Returns the rotation matrix for the given angle (in radians)
     */
    public static rotationMatrix(radians: number): Transform {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        return new Transform(
            cos, -sin,
            sin, cos,
            0, 0
        );
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
     * @brief Returns the current translation.
     */
    public getTranslationXY(): [number, number] {
        return [this.m31, this.m32];
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
     * @brief Returns the current scale.
     */
    public getScaleXY(): [number, number] {
        return [
            Vec2.magnitude(this.m11, this.m12), 
            Vec2.magnitude(this.m21, this.m22)
        ]
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
        return `${this.m11}\t${this.m21}\t${this.m31}\n${this.m12}\t${this.m22}\${this.m32}\n0\t0\t1`;
    }

    /**********************************************************************************************
     * 
     * Arithmetic
     * 
     *********************************************************************************************/

    /**
     * @brief Multiplies this matrix by another one.
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
     * @brief Returns a vector v' such that this * v = v'.
     */
    public multiplyVector(v: Vec2): Vec2 {
        return this.multiplyVectorXY(v.x, v.y);
    }

    /**
     * @brief Shortcut for multiplyVector. 
     */
    public multiplyVectorXY(x: number, y: number): Vec2 {
        return new Vec2(
            this.m11 * x + this.m21 * y + this.m31,
            this.m12 * x + this.m22 * y + this.m32
        );
    }

    /**
     * @brief Returns a vector r such that this * r = v.
     * This function is the opposite of multiplyVector.
     * This function might throw exceptions in two cases:
     * - the determinant is 0. Not much can be done here.
     * - m11 == m22 == 0. In this case, the object that owns this transform is infinitely small
     *  anyway, so it should not happen.
     */
    public revert(v: Vec2): Vec2 {
        let det = this.m11 * this.m22 - this.m12 * this.m21;
        if (det == 0) { // Or Math.abs(det) <= epsilon where epsilon is the tolerance?
            throw new Error("Transform#revert: irreversible matrix");
        }

        if (this.m11 != 0) {
            let y = this.m11 * v.y - this.m12 * (v.x - this.m31) - this.m11 * this.m32;
            y /= det;
            return new Vec2((v.x - this.m21 * y - this.m31) / this.m11, y);
        }

        if (this.m22 != 0) {
            let x = this.m22 * v.x - this.m21 * (v.y - this.m32) - this.m22 * this.m31;
            x /= det;
            return new Vec2(x, (v.y - this.m12 * x - this.m32) / this.m22);
        }

        throw new Error("Transform#revert: unable to revert the vector (both m11 and m22 are equal to zero)");
    }

    /**
     * @brief Reverts vector just like revert does.
     * This method is slightly more optimized than calling revert for each elements of vectors,
     * since some computations and tests are done once and for all.
     */
    public revertMultiple(vectors: Vec2[]): Vec2[] {
        let det = this.m11 * this.m22 - this.m12 * this.m21;
        if (det == 0) {
            throw new Error("Transform#revertMultiple: irreversible matrix");
        }
        let r: Vec2[] = [];

        if (this.m11 != 0) {
            let af = this.m11 * this.m32;
            for (let v of vectors) {
                let y = this.m11 * v.y - this.m12 * (v.x - this.m31) - af;
                y /= det;
                r.push(new Vec2((v.x - this.m21 * y - this.m31) / this.m11, y));
            }
            return r;
        }

        if (this.m22 != 0) {
            let de = this.m22 * this.m31;
            for (let v of vectors) {
                let x = this.m22 * v.x - this.m21 * (v.y - this.m32) - de;
                x /= det;
                r.push(new Vec2(x, (v.y - this.m12 * x - this.m32) / this.m22));
            }
            return r;
        }

        throw new Error("Transform#revertMultiple: unable to revert the vector (both m11 and m22 are equal to zero)");
    }

    /**
     * @brief Multiplies a vector by the transposed version of this matrix.
     * This matrix is here considered as 2D since otherwise we would have to return a Vec3.
     * In other words, m31 and m32 are not used in this method.
     */
    public multiplyTransposed(v: Vec2): Vec2 {
        return new Vec2(
            this.m11 * v.x + this.m12 * v.y,
            this.m21 * v.x + this.m22 * v.y
        );
    }

    /**********************************************************************************************
     * 
     * Transformations
     * 
     *********************************************************************************************/

    /**
     * @brief Places the matrix at the given place.
     */
    public place(x: number, y: number): Transform {
        return new Transform(
            this.m11, this.m12,
            this.m21, this.m22,
            x, y
        );
    }

    /**
     * @brief Places the matrix at the given place.
     */
    public placeInPlace(x: number, y: number): Transform {
        this.m31 = x;
        this.m32 = y;
        return this;
    }

    /**
     * @brief Moves the matrix alongside the vector (x, y), without regards for the current rotation and scale.
     * @see translate
     */
    public move(x: number, y: number): Transform {
        return new Transform(
            this.m11, this.m12,
            this.m21, this.m22,
            this.m31 + x, this.m32 + y
        );
    }

    /**
     * @brief Moves the matrix alongside the vector (x, y), without regards for the current rotation and scale.
     * @see translate
     */
    public moveInPlace(x: number, y: number): Transform {
        this.m31 += x;
        this.m32 += y;
        return this;
    }

    /**
     * @brief Moves the matrix alongside the vector (x, y).
     * Unlike move(), this method takes into consideration the current rotation.
     * @see move
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
     * @brief Moves the matrix alongside the vector (x, y).
     * Unlike move(), this method takes into consideration the current rotation.
     * @see move
     */
    public translateInPlace(x: number, y: number): Transform {
        this.m31 = this.m11 * x + this.m21 * y + this.m31;
        this.m32 = this.m12 * x + this.m22 * y + this.m32
        return this;
    }

    /**
     * @brief Centers the matrix around (x, y) relative to the current state.
     */
    public center(x: number, y: number): Transform {
        return this.translate(x, y);
    }

    /**
     * @brief Centers the matrix around (x, y) relative to the current state.
     */
    public centerInPlace(x: number, y: number): Transform {
        return this.translateInPlace(x, y);
    }

    public reset(): Transform {
        this.m21 = 0;
        this.m22 = 0;
        return this;
    }

    /**
     * @brief Scales the matrix.
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
     * @brief Scales the matrix.
     * @param x Factor alongside the x axis
     * @param y Factor alongside the y axis
     */
    public scaleInPlace(x: number, y: number): Transform {
        this.m11 *= x;
        this.m12 *= x;
        this.m21 *= y;
        this.m22 *= y;
        return this;
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
     * @param angle The angle in radians
     * @see rotateDegrees, radiansToDegrees
     */
    public rotateRadiansInPlace(angle: number): Transform {
        let cosa = Math.cos(angle);
        let sina = Math.sin(angle);
        this.m11 = this.m11 * cosa - this.m21 * sina;
        this.m12 = this.m12 * cosa - this.m22 * sina;
        this.m21 = this.m11 * sina + this.m21 * cosa;
        this.m22 = this.m12 * sina + this.m22 * cosa;
        return this;
    }

    /** 
     * Rotates the matrix.
     * @param angle The angle, in degrees
     * @see rotateRadians, degreesToRadians
     */
    public rotateDegrees(angle: number): Transform {
        return this.rotateRadians(Transform.degreesToRadians(angle));
    }

    /** 
     * Rotates the matrix.
     * @param angle The angle, in degrees
     * @see rotateRadians, degreesToRadians
     */
    public rotateDegreesInPlace(angle: number): Transform {
        return this.rotateRadiansInPlace(Transform.degreesToRadians(angle));
    }

    /**
     * Slants the matrix alongside the x or y axis.
     */
    public shear(x: number, y: number) {
        return new Transform(
            this.m11 + this.m21 * y,
            this.m12 + this.m22 * y,
            this.m11 * x + this.m21,
            this.m12 * x + this.m22,
            this.m31,
            this.m32
        );
    }

    /**
     * Slants the matrix alongside the x or y axis.
     */
    public shearInPlace(x: number, y: number) {
        this.m11 = this.m11 + this.m21 * y;
        this.m12 = this.m12 + this.m22 * y;
        this.m21 = this.m11 * x + this.m21;
        this.m22 = this.m12 * x + this.m22;
        return this;
    }

}