export interface DSLObject {
    type:string,
    i:number
}

export interface DSLActivity extends DSLObject {
    open:DSLCourse,
    close?:DSLCourse,
    due?:DSLCourse,
    cutoff?:DSLCourse
}

export interface DSLCourse extends DSLObject {
    modifier?: string
    time?: DSLTime
}

export interface DSLTime {
    type?: string,
    at?:string,
    number?:number,
    modifier?:string
}

export enum DSLTimeUnit {
    Week= "w",
    Day="d",
    Hour="h",
    Minute="m"
}

export interface DSLTimeType {
    symbol: string,
    value: number
}