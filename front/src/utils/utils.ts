
/** 
 * @param n the upper bound (non-inclusive) of the range
 * @returns A python-like range (o to $n-1)
 */
export function* range(n: number): Iterable<number> {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

/** 
 * @param from the lower bound of the range
 * @param to the upper bound (non-inclusive) of the range
 * @returns A python-like range (o to $n-1)
 */
export function* range2(from: number, to: number): Iterable<number> {
    for (let i = from; i < to; i++) {
        yield i;
    }
}

/** 
 * @param from the lower bound of the range
 * @param to the upper bound (non-inclusive) of the range
 * @param step The step between two values of the range
 * @returns A python-like range (o to $n-1)
 */
export function* range3(from: number, to: number, step: number): Iterable<number> {
    for (let i = from; i < to; i += step) {
        yield i;
    }
}

/** 
 * @param ms How much time to sleep in ms
 * @returns A promise used to make the current async context sleep
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Throw an error if $value is not true
 * @param value The value to assert
 * @param msg The error message to display
 */
export function assert(value: unknown, msg: string = "[no_err_msg]"): void {
    if (!value) {
        throw new Error('Assertion failed: ' + msg);
    }
}

/**
 * @return a random value between $min and $max
 */
export function randomIn(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * @return a random floating value between $min and $max
 */
export function randomFloatIn(min: number, max: number): number {
    return Math.random() * (max - min + 1) + min;
}

/**
 * @return true if the point [x, y] in in the rectangle [rx, ry, rw, rh]
 */
export function inRect(x: number, y: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return (x >= rx) && (x <= (rx + rw)) && (y >= ry) && (y <= (ry + rh));
}

/**
 * @return A random element from the given array
 */
export function pickOne<T>(items: T[]): T | undefined {
    const len = items.length | 0;
    return len ? items[Math.floor(Math.random() * len)] : undefined;
}

/**
 * @return A random element from the given array known to be non-empty
 */
export function forcePickOne<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/**
 * @return The value clamped to the given interval
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}