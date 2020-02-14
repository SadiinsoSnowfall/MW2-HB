import { Vec2 } from '../utils/Vec2';

export class EngineObject {
    pos: Vec2;
    rot: number;

    constructor(pos: Vec2 = Vec2.Zero, rot: number = 0) {
        this.pos = pos;
        this.rot = rot;
    }

}