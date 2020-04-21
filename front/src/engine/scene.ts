import { GameObject } from "./gameObject";
import { CScreen } from "./screen";
import { Prefab } from "./prefab";
import { AABBTree } from "./physics";
import { Vec2 } from "./utils";
import { Collider } from "./components";

/**
* @brief Defines any object that can interact with the game loop.
*/
export class Scene {
    protected _screen?: CScreen;
    protected foreground: GameObject[] = [];
    protected background: GameObject[] = [];
    protected tree: AABBTree;
    
    constructor() {
        this.tree = new AABBTree();
    }
    
    /**
    * @brief Retrieves the CScreen the scene is displayed on
    * @returns The CScreen the scene is displayed on
    */
    public screen(): CScreen | undefined {
        return this._screen;
    }
    
    /**
    * @brief Sets the CScreen of the scene
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
    * @brief Shortcut for screen().realFramerate()
    * @returns The current framerate excluding vsync or -1 if the scene is not rendered
    */
    public realFramerate(): number {
        return this._screen?.realFramerate() || -1;
    }

    public getTree(): AABBTree {
        return this.tree;
    }

    /**
     * Reset the scene
     */
    public clear(): void {
        this.background = [];
        this.foreground = [];
        this.tree = new AABBTree();
    }
    
    /**
    * @brief Instantiates an Object using a Prefab
    * @param prefab The model for the object to instantiate
    * @param x The x position of the object
    * @param y The y position of the object
    */
    public instantiate(prefab: Prefab, x: number, y: number): GameObject {
        let obj = new GameObject(x, y);
        prefab.applyTo(obj);
        this.addObject(obj);
        return obj;
    }
    
    /**
    * @brief Instantiates an Object using a Prefab
    * @param prefab The model for the object to instantiate
    * @param position The position of the object
    */
    public instantiateVec2(prefab: Prefab, position: Vec2): GameObject {
        return this.instantiate(prefab, position.x, position.y);
    }
    
    /**
    * @brief Adds an object to this scene
    */
    public addObject(obj: GameObject) {
        obj.setScene(this);
        const collider = obj.getCollider();
        if (collider == undefined) {
            this.foreground.push(obj);
        } else {
            this.tree.insert(collider);
        }
    }

    /**
    * @brief Displays this Scene on a canvas.
    * @param ctx The context from the canvas the scene must be drawn on.
    */
    public draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.background.length; ++i) {
            this.background[i].draw(ctx);
        }
        
        let toRem: Collider[] = [];

        for (const c of this.tree) {
            if (c.object.isEnabled()) {
                c.object.draw(ctx);               
            } else {
                toRem.push(c);
            }
        }

        for (const tr of toRem) {
            this.tree.remove(tr);
        }
        
        for (let i = 0; i < this.foreground.length; ++i) {
            this.foreground[i].draw(ctx);
        }

        this.tree.draw(ctx); // debug only
    }
    
    protected filterDisabled(base: GameObject[], count: number): GameObject[] {
        let index = 0;
        let enabled: GameObject[] = [];
        enabled.length = base.length - count;
        for (let i = 0; i < base.length; ++i) {
            const obj = base[i];
            if (obj.isEnabled()) {
                enabled[index++] = obj;
            }
        }

        return enabled;
    }
    
    /**
    * @brief Updates the game without displaying it.
    * @returns The next scene to update and display (usually, itself)
    */
    public update(): Scene {
        let count = 0;
        
        // update background
        for (let i = 0; i < this.background.length; ++i) {
            const obj = this.background[i];
            obj.update();
            if (!obj.isEnabled()) {
                ++count;
            }
        }
        
        if (count > 0) {
            this.background = this.filterDisabled(this.background, count);
            count = 0;
        }
        
        // update foreground
        for (let i = 0; i < this.foreground.length; ++i) {
            const obj = this.foreground[i];
            obj.update();
            if (!obj.isEnabled()) {
                ++count;
            }
        }

        if (count > 0) {
            this.foreground = this.filterDisabled(this.foreground, count);
        }
        
        // update colliders
        this.tree.update();

        return this;
    }
}