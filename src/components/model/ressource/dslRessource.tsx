import {EventType} from "@/components/model/interfaces/courseEvent";
import {DSLTimeType, DSLTimeUnit} from "@/components/model/interfaces/dsl";

export const TYPE_MAP_EVENT_TO_DSL: {[key in EventType]: string} = {
    [EventType.Practicum]: "Practicum",
    [EventType.Laboratory]: "Laboratory",
    [EventType.Seminar]: "Seminar",
    [EventType.Evaluation]: "Quiz",
    [EventType.Homework]: "Homework"
}

export const makeTypeMapDSLtoEvent = (dictToFlip : {[key in EventType]: string}): {[key: string]: EventType} => {
    const flipped = Object.fromEntries(Object.entries(dictToFlip).map(([k, v]) => [v, parseInt(k) as EventType]));
    flipped["Exam"] = EventType.Evaluation;
    return  flipped;
}
export const TYPE_MAP_DSL_TO_EVENT: {[key: string]: EventType} =makeTypeMapDSLtoEvent(TYPE_MAP_EVENT_TO_DSL)
export const DSL_TIME_UNIT_TO_MS: {[key in DSLTimeUnit]: number} = {
    [DSLTimeUnit.Week]: 6.048e+8,
    [DSLTimeUnit.Day]: 8.64e+7,
    [DSLTimeUnit.Hour]: 3.6e+6,
    [DSLTimeUnit.Minute]: 60000
}

export const MS_DSL_UNIT_SORTED_BY_DURATION: DSLTimeType[] = Object.entries(DSL_TIME_UNIT_TO_MS).map(([k, v]) => {return {symbol:k, value:v}}).sort((a:DSLTimeType, b:DSLTimeType) => b.value - a.value);

export const TIME_SEPARATOR = ":";
export const ADD_SYMBOL = "+";
export const SUB_SYMBOL = "-";
export const START_SYMBOL = "Start";
export const END_SYMBOL = "End";
export const COMMENT_SYMBOL = "#";
export const AT_SYMBOL = "@";