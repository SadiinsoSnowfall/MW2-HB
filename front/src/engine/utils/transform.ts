import { Vec2 } from "./vec2";

/**
 * Used to store both a position and a rotation
 */
export class Transform {    
    public pos: Vec2;
    public rot: number;

    constructor(pos: Vec2, rot: number) {
        this.pos = pos;
        this.rot = rot;
    }

    static readonly Neutral = Object.freeze(new Transform(Vec2.Zero, 0));

    /*
        METHODS
    */

}