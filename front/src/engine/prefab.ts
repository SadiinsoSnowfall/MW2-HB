import { GameObject } from "./gameObject";
import { assert } from "./utils";

export class Prefab {
    private _init: (_ : GameObject) => void;
    public id: number = -1;

    constructor(apply: (_ : GameObject) => void) {
        this._init = apply;
    }

    public applyTo(obj: GameObject): void {
        this._init(obj);
    }

    public setID(id: number) {
        assert(this.id === -1, `Error: Prefab#setID called twice on prefab {this.id}`);
        this.id = id;
    }

}