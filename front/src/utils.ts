
/** 
 * @param n the upper bound (non-inclusive) of the range
 * @returns A python-like range (o to $n-1)
 */
export function range(n: number) {
    return [...Array(n).keys()];
}

/** 
 * @param ms How much time to sleep in ms
 * @returns A promise used to make the current async context sleep
 */
export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
