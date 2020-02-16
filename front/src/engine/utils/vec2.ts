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
    public add(v: Vec2): void {
        this.x += v.x;
        this.y += v.y;
    }

    /**
     * Substract a number to this vector components
     */
    public sub(v: Vec2): void {
        this.x -= v.x;
        this.y -= v.y;
    }

    /**
     * Multiplies this vector components by a number
     */
    public mul(k: number): void {
        this.x *= k;
        this.y *= k;
    }

    /**
     * Divides this vector components by a number
     */
    public div(k: number): void {
        this.x /= k;
        this.y /= k;
    }

    /**
     * Multiplies this vector components by thoses of another vector
     */
    public scale(v: Vec2): void {
        this.x *= v.x;
        this.y *= v.y;
    }

    /**
     * Divides this vector components by thoses of another vector
     */
    public invScale(v: Vec2): void {
        this.x /= v.x;
        this.y /= v.y;
    }

    /**
     * Return the dot product of the two vectors
     * @param v The given vector
     */
    public dot(v: Vec2): number {
        return this.x * v.x + this.y + v.y;
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
    public normalize(): void {
        this.mul(1 / this.magnitude());
    }

    /**
     * Returns true if this vector is equal to v
     * @param v The vector to perform the check against
     */
    public eq(v: Vec2): boolean {
        return (this.x == v.x) && (this.y == v.y);
    }

    public toString(): string {
        return "(" + this.x + ", " + this.y + ")";
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

}