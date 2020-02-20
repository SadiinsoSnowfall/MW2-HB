
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
 * Return a random value between $min and $max
 */
export function randomIn(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
