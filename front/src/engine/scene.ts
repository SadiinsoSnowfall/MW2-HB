import { GameObject } from "./gameObject";
import { CScreen } from "./screen";
import { Prefab } from "./prefab";
import { AABBTree } from "./physics";
import { Vec2, inRect } from "./utils";
import { Collider, Behaviour } from "./components";
import { PhysicsEngine } from "./physics/physicsengine";

export const BACKGROUND:    number = 0;
export const MOBYDICK:      number = 1;
export const FOREGROUND:    number = 2;

export interface ObjectQuery {
    from: number,
    where: (o: GameObject) => boolean
}

/**
* @brief Defines any object that can interact with the game loop.
*/
export class Scene {
    protected _screen?: CScreen;
    protected clickables: Behaviour[] = [];
    protected foreground: GameObject[] = [];
    protected background: GameObject[] = [];
    protected tree: AABBTree;
    protected physics: PhysicsEngine;
    static MOBYDICK: number;
    
    constructor() {
        this.tree = new AABBTree(this);
        this.physics = new PhysicsEngine(this.tree);
    }

    public query(arg: ObjectQuery): GameObject | undefined {
        if (arg.from === MOBYDICK) {
            for (const collider of this.tree) {
                if (arg.where(collider.object)) {
                    return collider.object;
                }
            }
            return undefined;
        } else {
            const container = arg.from === BACKGROUND ? this.background : this.foreground;
            return container.find(arg.where);
        }
    }

    public queryAll(arg: ObjectQuery): GameObject[] {
        if (arg.from === MOBYDICK) {
            const found: GameObject[] = [];
            for (const collider of this.tree) {
                if (arg.where(collider.object)) {
                    found.push(collider.object);
                }
            }

            return found;
        } else {
            const container = arg.from === BACKGROUND ? this.background : this.foreground;
            return container.filter(arg.where);
        }
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
        this.clickables = [];
        this.tree = new AABBTree(this);
    }
    
    /**
    * @brief Instantiates an Object using a Prefab
    * @param prefab The model for the object to instantiate
    * @param x The x position of the object
    * @param y The y position of the object
    */
    public instantiate(prefab: Prefab, x: number, y: number): GameObject {
        let obj = new GameObject(x, y, prefab.id);
        prefab.applyTo(obj);
        return this.addObject(obj);
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
    public addObject(obj: GameObject): GameObject {
        obj.setScene(this);
        const collider = obj.getCollider();

        const behaviour = obj.getBehaviour();
        if (behaviour && behaviour.isClickable) {
            this.clickables.push(behaviour);
        }

        if (collider == undefined) {
            this.foreground.push(obj);
        } else {
            this.tree.insert(collider);
        }

        return obj;
    }

    /**
    * @brief Displays this Scene on a canvas.
    * @param ctx The context from the canvas the scene must be drawn on.
    */
    public draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.background.length; ++i) {
            this.background[i].draw(ctx);
        }

        for (const c of this.tree) {
            if (c.object.isEnabled()) {
                c.object.draw(ctx);               
            }
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
                this.removeClickable(obj);
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
                this.removeClickable(obj);
                ++count;
            }
        }

        if (count > 0) {
            this.foreground = this.filterDisabled(this.foreground, count);
        }
        
        // update colliders
        this.tree.update();
        this.physics.update();

        return this;
    }

    public removeClickable(obj: GameObject) {
        const b = obj.getBehaviour();
        if (b && b.isClickable) {
            this.clickables = this.clickables.filter(b => b.object.id != obj.id);
        }
    }

    public handleMouseDownEvent(pos: Vec2): boolean {
        for (let i = 0; i < this.clickables.length; ++i) {
            const clk = this.clickables[i];
            if (clk.isInside(pos)) {
                clk.onMouseDown(pos);
                return true;
            }
        }

        return false;
    }

    public handleMouseUpEvent(pos: Vec2): boolean {
        // notify everyone that the mouse was released
        for (let i = 0; i < this.clickables.length; ++i) {
            this.clickables[i].onMouseUp(pos);
        }

        // notify only the clicked GO that it was clicked
        for (let i = 0; i < this.clickables.length; ++i) {
            const clk = this.clickables[i];
            if (clk.isInside(pos)) {
                clk.onClick(pos);
                return true;
            }
        }

        return false;
    }

    public handleMouseMove(pos: Vec2): void {
        for (let i = 0; i < this.clickables.length; ++i) {
            this.clickables[i].onMouseMove(pos);
        }
    }

}