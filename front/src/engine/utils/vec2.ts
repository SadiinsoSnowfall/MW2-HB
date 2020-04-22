export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static readonly Zero = Object.freeze(new Vec2(0, 0));
    static readonly One = Object.freeze(new Vec2(1, 1));
    static readonly Infinity = Object.freeze(new Vec2(Infinity, Infinity));
    static readonly NegInfinity = Object.freeze(new Vec2(-Infinity, -Infinity));

    /*
        METHODS
    */

    /**
     * Add a number to this vector components
     */
    public add(v: Vec2): Vec2 {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Substract a number to this vector components
     */
    public sub(v: Vec2): Vec2 {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Multiplies this vector components by a number
     */
    public mul(k: number): Vec2 {
        this.x *= k;
        this.y *= k;
        return this;
    }

    /**
     * Divides this vector components by a number
     */
    public div(k: number): Vec2 {
        this.x /= k;
        this.y /= k;
        return this;
    }

    /**
     * Multiplies this vector components by those of another vector
     */
    public scale(v: Vec2): Vec2 {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    /**
     * Divides this vector components by those of another vector
     */
    public invScale(v: Vec2): Vec2 {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }

    /**
     * Multiplies both components by -1.
     */
    public neg(): Vec2 {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * Return the dot product of the two vectors
     * @param v The given vector
     */
    public dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    /**
     * Return the magnitude of this vector, also known as
     * its length or norm.
     */
    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Return the squared magnitude of this vector
     * {@see magnitude}.
     */
    public sqrMagnitude(): number {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * Makes this vector have a magnitude of 1
     */
    public normalize(): Vec2 {
        this.mul(1 / this.magnitude());
        return this;
    }

    /**
     * Returns true if this vector is equal to v
     * @param v The vector to perform the check against
     */
    public eq(v: Vec2): boolean {
        return (this.x == v.x) && (this.y == v.y);
    }

    /**
     * Returns true if the magnitude of the vector is 0
     */
    public isNull(): boolean {
        return ((this.x == 0) && (this.y == 0));
    }

    /**
     * Set the values of the vector
     */
    public set(v: Vec2): Vec2 {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    /**
     * Set the values of the vector
     */
    public setXY(x: number, y: number): Vec2 {
        this.x = x;
        this.y = y;
        return this;
    }

    public toString(): string {
        return "(" + this.x + ", " + this.y + ")";
    }

    public clone(): Vec2 {
        return new Vec2(this.x, this.y);
    }

    public sum(): number {
        return this.x + this.y;
    }

    /*
        STATIC FUNCTIONS
    */

    /**
     * Returns the magnitude of the vector (x, y).
     */
    public static magnitude(x: number, y: number) {
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Returns the squared magnitude of the vector (x, y).
     */
    public static sqrMagnitude(x: number, y: number) {
        return x * x + y * y;
    }

    /**
     * Returns a vector that is made from the smallest components of two vectors.
     */
    public static min(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }

    /**
     * Returns a vector that is made from the largest components of two vectors.
     */
    public static max(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }

    /**
     * Add two vectors component-wise.
     */
    public static add(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    /**
     * Substract two vectors component-wise.
     */
    public static sub(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    /**
     * Multiply a vector components by a given number
     */
    public static mul(v: Vec2, k: number): Vec2 {
        return new Vec2(v.x * k, v.y * k);
    }

    /**
     * Divide a vector components by a given number
     */
    public static div(v: Vec2, k: number): Vec2 {
        return new Vec2(v.x / k, v.y / k);
    }

    /**
     * Multiplies two vectors component-wise.
     */
    public static scale(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x * b.x, a.y * b.y);
    }

    /**
     * Divides two vectors component-wise.
     */
    public static invScale(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.x / b.x, a.y / b.y);
    }

    /**
     * Rotates a vector by the given angle (in radians!).
     */
    public static rotate(v: Vec2, radians: number) {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        return new Vec2(v.x * cos + v.y * sin, -v.x * sin + v.y * cos);
    }

    /**
     * Rotates a series of vector by the given angle.
     * Only one call to cos and sin is performed.
     */
    public static rotateMultiple(vs: Vec2[], radians: number): Vec2[] {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);
        let r: Vec2[] = [];
        for (const v of vs) {
            r.push(new Vec2(v.x * cos + v.y * sin, -v.x * sin + v.y * cos));
        }
        return r;
    }

    /**
     * Returns the opposite of a.
     */
    public static neg(a: Vec2): Vec2 {
        return new Vec2(-a.x, -a.y);
    }

    /**
     * Return a copy of the given vector with a magnitude of 1
     */
    public static normalize(v: Vec2): Vec2 {
        return Vec2.mul(v, 1 / v.magnitude());
    }

    /**
     * Return the distance between two vectors
     */
    public static distance(a: Vec2, b: Vec2): number {
        let x = b.x - a.x;
        let y = b.y - a.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * Return true if the two vectors are equals
     */
    public static equals(a: Vec2, b: Vec2): boolean {
        return a.eq(b);
    }

    /**
     * Returns the counterclockwise normal of a.
     * The result is not normalized (i.e. its magnitude may not be 1).
     */
    public static normalVector(a: Vec2): Vec2 {
        return new Vec2(-a.y, a.x);
    }

    /**
     * Returns the counterclockwise normal of ab.
     * Shortcut for Vec2.normal(Vec2.sub(b, a)).
     */
    public static normalEdge(a: Vec2, b: Vec2): Vec2 {
        return new Vec2(a.y - b.y, b.x - a.x);
    }

    /**
     * Returns the triple product of a, b, c.
     * The cross product is not defined for 2D vectors, so vectors are considered to have z component equal to 0.
     * The z component of the result is always equal to 0, so returning a Vec2 makes sense.
     */
    public static tripleProduct(a: Vec2, b: Vec2, c: Vec2): Vec2 {
        let f = a.x * b.y - a.y * b.x;
        return new Vec2(-f * c.y, f * c.x);
    }

    /**
     * Return the dot product of the two vectors
     */
    public static dot(a: Vec2, b: Vec2): number {
        return a.x * b.x + a.y * b.y;
    }
}