
/** 
 * @param n the upper bound (non-inclusive) of the range
 * @returns A python-like range (o to $n-1)
 */
export function* range(n: number) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

/** 
 * @param from the lower bound of the range
 * @param to the upper bound (non-inclusive) of the range
 * @returns A python-like range (o to $n-1)
 */
export function* range2(from: number, to: number) {
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
export function* range3(from: number, to: number, step: number) {
    for (let i = from; i < to; i += step) {
        yield i;
    }
}

/** 
 * @param ms How much time to sleep in ms
 * @returns A promise used to make the current async context sleep
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
