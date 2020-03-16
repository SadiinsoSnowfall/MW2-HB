
import { assert } from "./utils";
import { Vec2 } from "../engine/utils";

export interface InputListener {
    keys: string[];
    callback: () => void;
    consume: boolean;
}

/**
 * List of all possible actions with the mouse.
 * For the sake of simplicity, only two buttons can be used, left and right.
 */
export enum MouseAction {
    LEFT_CLICK,
    RIGHT_CLICK,
    DOUBLE_CLICK, // Double left click
    MOVE
}

export interface MouseListener {
    /**
     * The type of action that's been detected.
     */
    action: MouseAction;

    /**
     * Callback.
     * @param p The position of the click relative to the canvas
     * Because callbacks take a vector as an input,
     * there is for now no way to handle the use of the middle button
     * (which would allow for scrolling).
     */
    callback: (p: Vec2) => void;
}

export class InputManager {

    private static initialized: boolean = false;

    public static init(canvas: HTMLCanvasElement): void {
        assert(!InputManager.initialized, "InputManager#init called twice");
        InputManager.initialized = true;

        addEventListener('keydown', InputManager.onKeyDown);
        addEventListener('keyup', InputManager.onKeyUp);

        // The program won't compile if InputManager#onLeftClick and similar functions
        // don't take an Event as their input, instead of a MouseEvent.
        canvas.addEventListener('mousedown', InputManager.onMouseButtonDown);
        canvas.addEventListener('mouseup', InputManager.onMouseButtonUp);
        canvas.addEventListener('mousemove', InputManager.onMouseMove);
        canvas.addEventListener('click', InputManager.onLeftClick);
        canvas.addEventListener('dblclick', InputManager.onDoubleClick);
        canvas.addEventListener('contextmenu', InputManager.onRightClick);
    }

    public static print(): void {
        let keys = Object.entries(InputManager.keyMap).filter(([_, val]) => val).map(([key, _]) => key);
        if (keys.length > 0) {
            console.log(keys.join(','));
        }
    }


    /**********************************************************************************************
     * 
     * Keyboard
     * 
     *********************************************************************************************/

    
    private static keyMap: Record<string, boolean> = {};

    /**
     * The ListenerMap, sorted by key-combo length (see #checkKeys)
     * 
     * The values are instances of Set to prevent the same listener from
     * being registered twice and allow for O(1) insertion and deletion.
     * 
     * This method of storing listeners may be less optimized processing-power-wise
     * and memory-wise but it will not decrease in performance with the number
     * of listener added.
     * 
     */
    private static listeners: Map<string[], Set<InputListener>> = new Map();

    private static mouseListeners: Map<MouseAction, Set<MouseListener>> = new Map();

    public static subscribe(keys: string | string[], callback: () => void, consume: boolean = true): InputListener {
        // sort keys to reduce listener map size
        const fkeys: string[] = (typeof keys === 'string' ? [keys] : keys).sort();

        // create listener object
        const listener: InputListener = {
            keys: fkeys,
            callback: callback,
            consume: consume
        };

        // compute if absent
        let tmp = InputManager.listeners.get(fkeys);
        if (tmp === undefined) {
            tmp = new Set();
            InputManager.listeners.set(fkeys, tmp);
        }
        
        // add listener
        tmp.add(listener);

        // re-sort the map, keep the cost at init-time instead of runtime
        InputManager.listeners = new Map([...InputManager.listeners].sort((a, b) => b[0].length - a[0].length));

        return listener;
    }

    public static unsub(listener: InputListener): void {
        InputManager.listeners.get(listener.keys)?.delete(listener);
    }

    private static keysPressed(keys: string[]): boolean {
        for (const key of keys) {
            if (!InputManager.keyMap[key]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check the keys and fire the appropriate listeners
     * 
     * The InputListener map is ordered by key combo length so that higher
     * key-combo-length-listeners are checked & executed first
     * 
     * This is to ensure that a listener for Shift+Enter is executed instead
     * of a second listener for just Enter if both Shift and Enter keys are
     * pressed.
     * 
     * The keys are most likely "consumed" after the listeners are executed
     * (ie, set to "not pressed"). This is to prevent the Enter listener from
     * being executed after the Shift+Enter one.
     */
    private static checkKeys(): void {
        for (const [keys, listeners] of InputManager.listeners.entries()) {
            if (InputManager.keysPressed(keys)) {
                let shallConsume: boolean = false;
                for (const listener of listeners) {
                    listener.callback();
                    shallConsume = shallConsume || listener.consume;
                }

                if (shallConsume) {
                    for (const key of keys) {
                        InputManager.keyMap[key] = false;
                    }
                }
            }
        }
    }

    private static onKeyDown(e: KeyboardEvent): void {
        InputManager.keyMap[e.key] = true;
        InputManager.checkKeys();
    }

    private static onKeyUp(e: KeyboardEvent): void {
        InputManager.keyMap[e.key] = false;
    }


    /**********************************************************************************************
     * 
     * Mouse
     * 
     *********************************************************************************************/

    // Since only two mouse buttons are supported,
    // There is no real need for a map
    private static leftMouseButtonPressed: boolean = false;
    private static rightMouseButtonPressed: boolean = false;

    public static subscribeMouse(action: MouseAction, callback: (p: Vec2) => void): MouseListener {
        const listener: MouseListener = {
            action: action,
            callback: callback
        };

        let tmp = InputManager.mouseListeners.get(action);
        if (tmp === undefined) {
            tmp = new Set();
            InputManager.mouseListeners.set(action, tmp);
        }
        tmp.add(listener);

        return listener;
    }

    public static unsubMouse(listener: MouseListener): void {
        InputManager.mouseListeners.get(listener.action)?.delete(listener);
    }

    private static setMouseButtonPressed(e: Event, state: boolean): void {
        switch ((e as MouseEvent).button) {
            case 0: {
                InputManager.leftMouseButtonPressed = state;
                break;
            }

            case 1: {
                InputManager.rightMouseButtonPressed = state;
                break;
            }

            default:
                break;
        }
    }

    private static onMouseButtonDown(e: Event): void {
        InputManager.setMouseButtonPressed(e, true);
    }

    private static onMouseButtonUp(e: Event): void {
        InputManager.setMouseButtonPressed(e, false);
    }

    private static handleMouseEvent(e: Event, a: MouseAction): void {
        let e2 = e as MouseEvent;
        let p = new Vec2(e2.clientX, e2.clientY);
        let listeners = InputManager.mouseListeners.get(a);
        if (listeners !== undefined) {
            for (const listener of listeners) {
                listener.callback(p);
            }
        }
    }

    private static onLeftClick(e: Event): void {
        console.log("onLeftClick");
        InputManager.handleMouseEvent(e, MouseAction.LEFT_CLICK);
    }

    private static onRightClick(e: Event): void {
        InputManager.handleMouseEvent(e, MouseAction.RIGHT_CLICK);
    }

    private static onDoubleClick(e: Event): void {
        InputManager.handleMouseEvent(e, MouseAction.DOUBLE_CLICK);
    }

    private static onMouseMove(e: Event): void {
        console.log("onMouseMove");
        InputManager.handleMouseEvent(e, MouseAction.MOVE);
    }

}