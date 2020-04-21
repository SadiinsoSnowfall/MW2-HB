import { Scene } from "../scene";


export class PhysicsEngine {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public update() {
        const tree = this.scene.getTree();

        
    }

}