const KEY_PREIFX = 'ETSMTL-COURSE-PLANNER-'

export const getValue = (key:string, defaultValue:any) => {
    return JSON.parse(typeof window === "undefined" ? String(defaultValue) : localStorage.getItem(KEY_PREIFX+key) || String(defaultValue));
}


export const callbackIfValuePresent = (key:string, parseFunction:(value:string)=>any, setFunction:(value:any)=>void):void => {
    if (typeof window !== "undefined") {
        const maybeValue = localStorage.getItem(KEY_PREIFX+key);
        if (maybeValue != null) {
            setFunction(parseFunction(maybeValue));
        }
    }
}
export const setValue = (key: string, value: any) => {
    localStorage.setItem(KEY_PREIFX+key, JSON.stringify(value));
}