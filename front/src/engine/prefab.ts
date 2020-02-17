import { Display, RigidBody, Collider, Behaviour } from "./components";
import { GameObject } from "./gameObject";

export class Prefab {
    private _init: (_ : GameObject) => void;    

    constructor(apply: (_ : GameObject) => void) {
        this._init = apply;
    }

    public applyTo(obj: GameObject): void {
        this._init(obj);
    }

}