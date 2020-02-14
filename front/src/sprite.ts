
/**
 * @brief A superclass for all visible objects.
 * It provides methods for altering how the object is rendered,
 * i.e. move the objet in the plan, rotate or scale it, etc.
 * Subclasses need to override draw themselves since the default implementation
 * given here does nothing.
 */
export abstract class Sprite {
    private x: number;
    private y: number;
    private transform: SVGMatrix;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.transform = new SVGMatrix(); // not sure if it's right
    }
}