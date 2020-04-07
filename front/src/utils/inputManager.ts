
import { assert } from "./utils";
import { Vec2 } from "../engine/utils";

export interface InputListener {
    keys: string[];
    callback: () => void;
    consume: boolean;
}

/**
 * List of generic mouse actions
 */
export enum MouseAction {
    MOVE = -2,
    DOUBLE_CLICK = -1, // Double left click
    LEFT_CLICK = 0,
    MIDDLE_CLICK = 1,
    RIGHT_CLICK = 2,
}

/**
 * Listener for mouse event
 */
type MouseListener = (p: Vec2) => void;

export class InputManager {

    private static canvas: HTMLCanvasElement | undefined;
    private static initialized: boolean = false;

    public static init(canvas: HTMLCanvasElement): void {
        assert(!InputManager.initialized, "InputManager#init called twice");
        InputManager.initialized = true;

        addEventListener('keydown', InputManager.onKeyDown);
        addEventListener('keyup', InputManager.onKeyUp);

        InputManager.canvas = canvas;

        // The program won't compile if InputManager#onLeftClick and similar functions
        // don't take an Event as their input, instead of a MouseEvent.
        canvas.addEventListener('mousedown', InputManager.onMouseButtonDown);
        canvas.addEventListener('mouseup', InputManager.onMouseButtonUp);
        canvas.addEventListener('mousemove', InputManager.onMouseMove);
        canvas.addEventListener('dblclick', InputManager.onDoubleClick);

        canvas.oncontextmenu = () => { return false; }; // disable context menu
        //window.addEventListener("wheel", (e) => { e.preventDefault(); }, { passive: false }); // uncomment to prevent scroll using mouse wheel

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

    private static mouseListeners: Map<number, Set<MouseListener>> = new Map();

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
        for (let i = 0; i < keys.length; ++i) {
            if (!InputManager.keyMap[keys[i]]) {
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
                    for (let i = 0; i < keys.length; ++i) {
                        InputManager.keyMap[keys[i]] = false;
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

    /**
     * Map to store the state of each buttons
     */
    private static buttonsState: Map<number, boolean> = new Map();

    public static subscribeMouse(action: number, callback: (p: Vec2) => void): MouseListener{
        let tmp = InputManager.mouseListeners.get(action);
        if (tmp === undefined) {
            tmp = new Set();
            InputManager.mouseListeners.set(action, tmp);
        }

        tmp.add(callback);
        return callback;
    }

    public static isButtonPressed(button: number): boolean {
        return InputManager.buttonsState.get(button) || false;
    }

    public static unsubMouse(listener: MouseListener): void {
        // memory layout / comsumption to unsub compute time tradeoff
        // as the mouseListeners map will always be very small (5 elems max)
        // the increase in compute time will be minimal
        for (const set of InputManager.mouseListeners.values()) {
            if (set.delete(listener)) {
                return;
            }
        }
    }

    private static getCanvas(): HTMLCanvasElement {
        return InputManager.canvas as HTMLCanvasElement;
    }

    private static handleMouseEvent(e: MouseEvent, a: number): void {
        const pos = new Vec2(e.pageX - InputManager.getCanvas().offsetLeft, e.pageY - InputManager.getCanvas().offsetTop);
        const listeners = InputManager.mouseListeners.get(a);
        if (listeners !== undefined) {
            for (const listener of listeners) {
                listener(pos);
            }
        }
    }

    /**
     * Called on button press
     */
    private static onMouseButtonDown(e: MouseEvent): void {
        e.preventDefault(); // prevent browser actions
        InputManager.buttonsState.set(e.button, true);
    }

    /**
     * Called on button release
     */
    private static onMouseButtonUp(e: MouseEvent): void {
        InputManager.buttonsState.set(e.button, false);
        InputManager.handleMouseEvent(e, e.button); // handle event on release
    }

    /**
     * Generic double left click event
     */
    private static onDoubleClick(e: MouseEvent): void {
        InputManager.handleMouseEvent(e, MouseAction.DOUBLE_CLICK);
    }

    /**
     * Mouse move event
     */
    private static onMouseMove(e: MouseEvent): void {
        InputManager.handleMouseEvent(e, MouseAction.MOVE);
    }

}