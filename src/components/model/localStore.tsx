const KEY_PREIFX = 'ETSMTL-COURSE-PLANNER-'

/**
 * Gets the value mapped to the key in the local store or the given default value if not present.
 * @param key to look for in the local store.
 * @param defaultValue to return if key is not present.
 */
export const getValue = (key:string, defaultValue:any) => {
    return JSON.parse(typeof window === "undefined" ? String(defaultValue) : localStorage.getItem(KEY_PREIFX+key) || String(defaultValue));
}

/**
 * Checks if the local store has the given key. If so, parses the data using the parse function and sets it using the set function.
 * @param key to look for in the local store.
 * @param parseFunction function handle to parse the stored data.
 * @param setFunction function handle to set the parsed data.
 */
export const callbackIfValuePresent = (key:string, parseFunction:(value:string)=>any, setFunction:(value:any)=>void):void => {
    if (typeof window !== "undefined") {
        const maybeValue = localStorage.getItem(KEY_PREIFX+key);
        if (maybeValue != null) {
            setFunction(parseFunction(maybeValue));
        }
    }
}
/**
 *
 * @param key
 * @param value
 */
export const setValue = (key: string, value: any) => {
    localStorage.setItem(KEY_PREIFX+key, JSON.stringify(value));
}