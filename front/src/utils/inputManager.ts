import { assert } from "./utils";

export interface InputListener {
    keys: string[];
    callback: () => void;
    consume: boolean;
}

export class InputManager {
    private static initialized: boolean = false;
    private static keyMap: Record<string, boolean> = {};

    /**
     * The ListenerMap, sorted by key-combo length (see #checkKeys)
     * 
     * The values are instances of Set to prevent the same listener from
     * being registered twice and allow for O(1) insertion and deletion.
     * 
     * This method of storing listeners may be less optimized processing-power-
     * and memory-wise but it will not decrease in performance with the number
     * of listener added.
     * 
     */
    private static listeners: Map<string[], Set<InputListener>> = new Map();

    public static init(): void {
        assert(!InputManager.initialized, "InputManager#init called twice");
        addEventListener('keydown', InputManager.onKeyDown);
        addEventListener('keyup', InputManager.onKeyUp);
    }

    public static print(): void {
        let keys = Object.entries(InputManager.keyMap).filter(([_, val]) => val).map(([key, _]) => key);
        if (keys.length > 0) {
            console.log(keys.join(','));
        }
    }

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

}