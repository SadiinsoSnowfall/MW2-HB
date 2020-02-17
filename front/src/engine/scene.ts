import { GameObject } from "./gameObject";
import { CScreen } from "../screen";
import { Prefab } from "./prefab";

/**
 * @brief Defines any object that can interact with the game loop.
 */
export class Scene {
    protected _screen?: CScreen;
    protected objects: GameObject[] = [];

    /**
     * @brief Retrieve the CScreen the scene is displayed on
     * @returns The CScreen the scene is displayed on
     */
    public screen(): CScreen | undefined {
        return this._screen;
    }

    /**
     * @brief Set the CScreen of the scene
     */
    public setScreen(screen: CScreen): void {
        this._screen = screen;
    }

    /**
     * @brief Shortcut for screen().currentFrame()
     * @returns The current frame being displayed or -1 if the scene is not rendered
     */
    public tick(): number {
        return this._screen?.currentFrame() || -1;
    }

    /**
     * @brief Shortcut for screen().framerate()
     * @returns The current framerate or -1 if the scene is not rendered
     */
    public framerate(): number {
        return this._screen?.framerate() || -1;
    }

    /**
     * Instantiate an Object using a Prefab
     * @param prefab The model for the object to instantiate
     * @param x The x position of the object
     * @param y The y position of the object
     */
    public instantiate(prefab: Prefab, x: number, y: number): GameObject {
        let obj = new GameObject(x, y);
        prefab.applyTo(obj);
        obj.setScene(this);
        this.objects.push(obj);
        return obj;
    }

    /**
     * @brief Displays this Scene on a canvas.
     * @param ctx The context from the canvas the scene must be drawn on.
     */
    public draw(ctx: CanvasRenderingContext2D): void {
        for (let o of this.objects) {
            o.draw(ctx);
        }
    }

    /**
     * @brief Updates the game without displaying it.
     * @returns The next scene to update and display (usually, itself)
     */
    public update(): Scene {
        for (let o of this.objects) {
            o.update();
        }
        return this;
    }
}