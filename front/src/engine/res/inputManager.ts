
import { Vec2, assert } from "../utils";
import { MenuManager } from "../ui";
import { canvas } from '../screen';

export interface InputListener {
    keys: string[];
    callback: () => void;
    consume: boolean;
}

/**
* List of generic mouse actions
*/
export enum MouseAction {
    RIGHT_DOWN = -5,
    MIDDLE_DOWN = -4,
    LEFT_DOWN = -3,

    MOVE = -2,
    DOUBLE_CLICK = -1, // Double left click

    LEFT_CLICK = 0,
    MIDDLE_CLICK = 1,
    RIGHT_CLICK = 2,
}

export namespace Inputs {

    /**
    * Listener for mouse event
    */
    type MouseListener = (p: Vec2) => void;

    let canvasRef: HTMLCanvasElement = undefined as any as HTMLCanvasElement;
    let initialized: boolean = false;

    export function init(): void {
        assert(!initialized, "InputManager#init called twice");
        initialized = true;
        
        addEventListener('keydown', onKeyDown);
        addEventListener('keyup', onKeyUp);
        
        // The program won't compile if InputManager#onLeftClick and similar functions
        // don't take an Event as their input, instead of a MouseEvent.
        canvas.addEventListener('mousedown', onMouseButtonDown);
        canvas.addEventListener('mouseup', onMouseButtonUp);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('dblclick', onDoubleClick);
        
        canvas.oncontextmenu = () => { return false; }; // disable context menu
        //window.addEventListener("wheel", (e) => { e.preventDefault(); }, { passive: false }); // uncomment to prevent scroll using mouse wheel
        
    }

    export function print(): void {
        let keys = Object.entries(keyMap).filter(([_, val]) => val).map(([key, _]) => key);
        if (keys.length > 0) {
            console.log(keys.join(','));
        }
    }


    /**********************************************************************************************
    * 
    * Keyboard
    * 
    *********************************************************************************************/


    let keyMap: Record<string, boolean> = {};

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
    let listeners: Map<string[], Set<InputListener>> = new Map();

    let mouseListeners: Map<number, Set<MouseListener>> = new Map();

    export function subscribe(keys: string | string[], callback: () => void, consume: boolean = true): InputListener {
        // sort keys to reduce listener map size
        const fkeys: string[] = (typeof keys === 'string' ? [keys] : keys).sort();
        
        // create listener object
        const listener: InputListener = {
            keys: fkeys,
            callback: callback,
            consume: consume
        };
        
        // compute if absent
        let tmp = listeners.get(fkeys);
        if (tmp === undefined) {
            tmp = new Set();
            listeners.set(fkeys, tmp);
        }
        
        // add listener
        tmp.add(listener);
        
        // re-sort the map, keep the cost at init-time instead of runtime
        listeners = new Map([...listeners].sort((a, b) => b[0].length - a[0].length));
        
        return listener;
    }

    function unsub(listener: InputListener): void {
        listeners.get(listener.keys)?.delete(listener);
    }

    function keysPressed(keys: string[]): boolean {
        for (let i = 0; i < keys.length; ++i) {
            if (!keyMap[keys[i]]) {
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
    function checkKeys(): void {
        for (const [keys, lstnrs] of listeners.entries()) {
            if (keysPressed(keys)) {
                let shallConsume: boolean = false;
                
                for (const listener of lstnrs) {
                    listener.callback();
                    shallConsume = shallConsume || listener.consume;
                }
                
                if (shallConsume) {
                    for (let i = 0; i < keys.length; ++i) {
                        keyMap[keys[i]] = false;
                    }
                }
            }
        }
    }

    function onKeyDown(e: KeyboardEvent): void {
        keyMap[e.key] = true;
        checkKeys();
    }

    function onKeyUp(e: KeyboardEvent): void {
        keyMap[e.key] = false;
    }


    /**********************************************************************************************
    * 
    * Mouse
    * 
    *********************************************************************************************/

    /**
    * Map to store the state of each buttons
    */
    let buttonsState: Map<number, boolean> = new Map();

    export function subscribeMouse(action: number, callback: (p: Vec2) => void): MouseListener{
        let tmp = mouseListeners.get(action);
        if (tmp === undefined) {
            tmp = new Set();
            mouseListeners.set(action, tmp);
        }
        
        tmp.add(callback);
        return callback;
    }

    export function isButtonPressed(button: number): boolean {
        return buttonsState.get(button) || false;
    }

    export function unsubMouse(listener: MouseListener): void {
        // memory layout / comsumption to unsub compute time tradeoff
        // as the mouseListeners map will always be very small (5 elems max)
        // the increase in compute time will be minimal
        for (const set of mouseListeners.values()) {
            if (set.delete(listener)) {
                return;
            }
        }
    }

    // using the same Vec2 for each mouse event to prevent mass-allocation
    // the event processing is singlethreaded, this should not cause any problem
    let eventPos: Vec2 = Vec2.Zero.clone();
    let lastMousePos: Vec2 = Vec2.Zero.clone();

    function handleMouseEvent(e: MouseEvent, a: number): void {
        if (document.fullscreen) {
            eventPos.setXY(e.screenX, e.screenY);
        } else {
            eventPos.setXY(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        }
        
        if (a == MouseAction.MOVE) {
            lastMousePos.set(eventPos);
        }
        
        if (!MenuManager.captureEvent(e, a, eventPos)) { // check menus first
            const listeners = mouseListeners.get(a);
            if (listeners !== undefined) {
                for (const listener of listeners) {
                    listener(eventPos);
                }
            }
        }
    }

    export function getLastMousePos(): Vec2 {
        return lastMousePos;
    }

    /**
    * Called on button press
    */
    function onMouseButtonDown(e: MouseEvent): void {
        e.preventDefault(); // prevent browser actions
        buttonsState.set(e.button, true);
        handleMouseEvent(e, -e.button - 3); // handle event
    }

    /**
    * Called on button release
    */
    function onMouseButtonUp(e: MouseEvent): void {
        e.preventDefault();// prevent browser actions
        buttonsState.set(e.button, false);
        handleMouseEvent(e, e.button); // handle event on release
    }

    /**
    * Generic double left click event
    */
    function onDoubleClick(e: MouseEvent): void {
        handleMouseEvent(e, MouseAction.DOUBLE_CLICK);
    }

    /**
    * Mouse move event
    */
    function onMouseMove(e: MouseEvent): void {
        handleMouseEvent(e, MouseAction.MOVE);
    }

}