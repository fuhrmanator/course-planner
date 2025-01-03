import {ActivityType, CourseEvent, CourseType, EventType} from "@/components/model/interfaces/courseEvent";
import parser from "./grammar/dsl"
import {
    getOrAddUnsavedState,
    hasCutoffDate,
    hasDueDate,
    setEndIfHomework,
    sortEventsWithTypeByOldestStart
} from "@/components/controller/util/eventsOperations";
import {
    ADD_SYMBOL,
    AT_SYMBOL,
    COMMENT_SYMBOL,
    DSL_TIME_UNIT_TO_MS,
    EVALUATION_INDEX,
    HEAD_INDEX,
    HOMEWORK_INDEX,
    MS_DSL_UNIT_SORTED_BY_DURATION,
    OPEN_INDEX,
    STATEMENT_SEPARATOR,
    SUB_SYMBOL,
    TIME_SEPARATOR,
    TYPE_MAP_DSL_TO_EVENT,
    TYPE_MAP_EVENT_TO_DSL,
    TYPE_TO_STATEMENT_SIZE
} from "@/components/model/ressource/dslRessource";
import {
    DSLActivity,
    DSLCourse,
    DSLDateRef,
    DSLObject, DSLTime,
    DSLTimeType,
    DSLTimeUnit
} from "@/components/model/interfaces/dsl";

/**
 * Creates the relative offset part of the DSL based on the time difference between two dates
 * @param ref reference date. ref > offset -> negative offset (-). ref < offset -> positive offset (+)
 * @param offset offset date.
 * @param atRecursion for internal use.
 */
export const dateOffsetAsDSL = (ref: Date, offset: Date, atRecursion: boolean = false): string => {

    const offsetToRepresent = offset.getTime() - ref.getTime();

    let result = "";
    if (offsetToRepresent !== 0) {
        let unitToUse = MS_DSL_UNIT_SORTED_BY_DURATION.find((dslUnit: DSLTimeType) => offsetToRepresent % dslUnit.value === 0);
        if (typeof unitToUse === "undefined") {
            if (atRecursion) { // prevents infinite recursion due to precision
                throw new Error(`No DSL units can accurately represent the duration between ${ref} and ${offset}`)
            }
            const hours = offset.getHours();
            const minutes = offset.getMinutes();
            const truncatedOffset = new Date(offset)
            truncatedOffset.setHours(0)
            truncatedOffset.setMinutes(0)
            const truncatedResult = dateOffsetAsDSL(ref, truncatedOffset, true);
            result = `${truncatedResult}${makeDSLAt(hours,minutes)}`
        } else {
            const numberOfUnitToUse = offsetToRepresent / unitToUse.value;
            result = makeDSLOffset(numberOfUnitToUse,unitToUse.symbol);
        }
    }

    return result;
}
/**
 * Finds the closest date to the given ref amongst the given sortedEvents and returns a DSL string that represents
 * the ref date offset's to the closest date.
 * @param ref date whose offset with the closest date will be represented by the returned DSL
 * @param sortedEvents events containing dates (start or end) who are candidates to be the closest.
 */
export const makeDSLRelativeToClosestDate = (ref: Date, sortedEvents: CourseEvent[]): string => {
    const allPossibleClosestDates = sortedEvents.flatMap((event: CourseEvent) => [event.start, event.end]);
    let closestIndex = -1;
    let closestValue = Number.MAX_VALUE;
    for (let i = 0; i < allPossibleClosestDates.length; i++) {
        let currentValue = Math.abs(allPossibleClosestDates[i].getTime() - ref.getTime())
        if (currentValue < closestValue) {
            closestValue = currentValue;
            closestIndex = i;
        }
    }
    const closestEventIndex = Math.floor(closestIndex / 2);
    const closestDate = allPossibleClosestDates[closestIndex];
    const closestDSLModifier = closestIndex % 2 == 0 ? DSLDateRef.Start : DSLDateRef.End;
    const closestOffset = dateOffsetAsDSL(closestDate, ref);
    return `${makeDSLDate(sortedEvents[closestEventIndex].type,closestEventIndex, closestDSLModifier)}${closestOffset}`
}
/**
 * Produce a DSL representation of the given event.
 * Each element (open, cutoff, due, close) of the DSL will be relative to the closest date present in the given sortedEvents.
 * @param event whose scheduling will be represented by the produced DSL
 * @param eventIndex index of the given event element
 * @param sortedEvents events whose dates are candidate to be the closest to the given event. Must be sorted in chronological order.
 */
export const makeDSLClosestMatch = (event: CourseEvent, eventIndex: number, sortedEvents: CourseEvent[]): string[] => {
    let dsl = instantiateDSL(event.type);

    dsl[HEAD_INDEX] = makeDSLHead(event.type, eventIndex);
    dsl[OPEN_INDEX] = makeDSLRelativeToClosestDate(event.start, sortedEvents);

    if (hasDueDate(event)) {
        dsl[HOMEWORK_INDEX.due] = makeDSLRelativeToClosestDate(event.due!, sortedEvents);
    }
    if (hasCutoffDate(event)) {
        dsl[HOMEWORK_INDEX.cutoff] = makeDSLRelativeToClosestDate(event.cutoff!, sortedEvents)
    }

    if (event.type === EventType.Evaluation) {
        dsl[EVALUATION_INDEX.close] = makeDSLRelativeToClosestDate(event.end, sortedEvents);
    }

    return dsl;
}

/**
 * Recreates the DSL string based on the output of the DSL bundle
 * @param node a property of the returned structure by the DSL bundle
 */
export const recreateDSL = (node: any): any => {
    switch (node.type) {
        case 'Quiz':
            return `${node.type}${node.i} ${recreateDSL(node.open)} ${recreateDSL(node.close)}`;
        case 'Exam':
            return `${node.type}${node.i} ${recreateDSL(node.open)}`;
        case 'Seminar':
        case 'Laboratory':
        case 'Practicum':
            let timeRef ="";
            if (typeof node.time !== "undefined") {
                if (typeof node.time.modifier !== "undefined") {
                    timeRef = timeRef.concat(node.time.modifier,node.time.number, node.time.type);
                }
               if (typeof node.time.at !== "undefined") {
                   timeRef = timeRef.concat(AT_SYMBOL, node.time.at)
               }
            }
            return `${node.type}${node.i}${node.modifier ? node.modifier : ''}${timeRef}`;
        case 'Homework':
            return `${node.type}${node.i} ${recreateDSL(node.open)} ${recreateDSL(node.due)} ${recreateDSL(node.cutoff)}`;
        default:
            throw new Error(`Unknown node type ${node.type}`);
    }
};
/**
 * Maps the DSL modifier (start, end, finish) to the actual properties of the event object and return the relevant date.
 * @param dsl DSL course object (open, duedate, cutoff, close)
 * @param event object whose date will be returned.
 */
const getDateReferenceByDSL = (dsl: DSLCourse, event: CourseEvent): Date => {
    let date;
    if (typeof dsl.modifier === "undefined" || dsl.modifier === DSLDateRef.Start) {
        date = new Date(event.start)
    } else if (dsl.modifier === DSLDateRef.End) {
        date = new Date(event.end)
    } else {
        throw Error("Bad course reference for " + JSON.stringify(dsl))
    }
    return date;
}

/**
 * Takes a DSLCourse produced by the DSL bundle and the date to which it is relative and transforms it into
 * a date representation.
 * @param dsl DSL Course produced by the bundle
 * @param relativeTo date who's referenced by the DSLCourse (i.e. Seminar1Start, date is the start of the first seminar)
 */
const parseDSLTimeToDate = (dsl: DSLCourse, relativeTo: Date): Date => {
    let newDate = new Date(relativeTo);
    if (typeof dsl.time !== "undefined") {
        if (typeof dsl.time.at !== "undefined") {
            const timeParts = dsl.time.at.split(TIME_SEPARATOR);
            newDate.setHours(parseInt(timeParts[0]));
            newDate.setMinutes(parseInt(timeParts[1]));
        }
        if (typeof dsl.time.type !== "undefined") {
            // having a type guarantees having a number and modifier
            if (dsl.time.type in DSL_TIME_UNIT_TO_MS) {
                const offset = DSL_TIME_UNIT_TO_MS[dsl.time.type as DSLTimeUnit] * dsl.time.number!
                switch (dsl.time.modifier!) {
                    case ADD_SYMBOL:
                        newDate = new Date(newDate.getTime() + offset);
                        break;
                    case SUB_SYMBOL:
                        newDate = new Date(newDate.getTime() - offset);
                        break;
                    default:
                        console.log("Warning:", dsl.time.modifier, "is a unsupported time operation format")
                        break;
                }
            }
        } else {
            console.log("Warning:", dsl.time.type, "is a unsupported time modifier format")
        }
    }
    return newDate;
}

const getEventReferencedByDSL = (dsl: DSLObject | undefined, events: CourseEvent[]): CourseEvent | undefined => {
    let event = undefined;
    if (typeof dsl !== "undefined") {
        if (dsl.type in TYPE_MAP_DSL_TO_EVENT) {
            let sortedActivitiesWithType = sortEventsWithTypeByOldestStart(events, TYPE_MAP_DSL_TO_EVENT[dsl.type])
            let index = dsl.i - 1;
            if (index >= 0 && index < sortedActivitiesWithType.length) {
                event = sortedActivitiesWithType[index];
            } else {
                console.log("Warning: element of type",
                    dsl.type,
                    "has index",
                    dsl.i,
                    "out of bounds. There are currently",
                    sortedActivitiesWithType.length,
                    "activities with provided type")
            }
        } else {
            console.log("Warning: unrecognized type", dsl.type)
        }
    }
    return event;
}

export const makeComment = (text: string): string => {
    return `${COMMENT_SYMBOL}${text}`;
}

export const parseAndCast = (dsl:string): DSLActivity[] => {
    const rawParsed: any[] = parser.parse(dsl) as any[];
    return rawParsed[1] as DSLActivity[];
}

/**
 * Applies DSL instructions to the given activities.
 * @param dsl to apply to the activities.
 * @param activities to modify using the DSL
 * @param newCourseEvents events referenced by the DSL (seminars, practicums, laboratories)
 */
export const parseDSL = (dsl: string, activities: CourseEvent[], newCourseEvents: CourseEvent[]): void => {
    const parsedDSL: DSLActivity[] = parseAndCast(dsl);
    let referencedCourse;
    console.log(JSON.stringify(parsedDSL));
    for (const parsedActivity of parsedDSL) {
        let activityToMove = getEventReferencedByDSL(parsedActivity, activities);
        if (typeof activityToMove !== "undefined") {
            activityToMove = getOrAddUnsavedState(activityToMove);
            if (!activityToMove) {
                throw new Error("Activity not found in current events")
            }
            activityToMove.dsl = recreateDSL(parsedActivity).split(STATEMENT_SEPARATOR);
            referencedCourse = getEventReferencedByDSL(parsedActivity.open, newCourseEvents);
            if (typeof referencedCourse !== "undefined") {
                activityToMove.start = parseDSLTimeToDate(parsedActivity.open, getDateReferenceByDSL(parsedActivity.open, referencedCourse))
            }

            referencedCourse = getEventReferencedByDSL(parsedActivity.close, newCourseEvents);
            if (typeof referencedCourse !== "undefined") {
                activityToMove.end = parseDSLTimeToDate(parsedActivity.close!, getDateReferenceByDSL(parsedActivity.close!, referencedCourse))
            }

            referencedCourse = getEventReferencedByDSL(parsedActivity.cutoff, newCourseEvents);
            if (typeof referencedCourse !== "undefined") {
                activityToMove.cutoff = parseDSLTimeToDate(parsedActivity.cutoff!, getDateReferenceByDSL(parsedActivity.cutoff!, referencedCourse))
            }

            referencedCourse = getEventReferencedByDSL(parsedActivity.due, newCourseEvents);
            if (typeof referencedCourse !== "undefined") {
                activityToMove.due = parseDSLTimeToDate(parsedActivity.due!, getDateReferenceByDSL(parsedActivity.due!, referencedCourse))
            }

            setEndIfHomework(activityToMove)
        }
    }
}

export const unifyDSL = (dsl:string[]): string => {
    return dsl.filter(statement => statement !== "").join(STATEMENT_SEPARATOR);
}

export const instantiateDSL = (type:EventType): string[] => {
    let dsl:string[] = []
    if (type in TYPE_TO_STATEMENT_SIZE) {
        dsl = Array(TYPE_TO_STATEMENT_SIZE[type as ActivityType]).fill("");
    }
    return dsl;
}

const makeDSLHead = (type: EventType, index: number): string => {
    return `${TYPE_MAP_EVENT_TO_DSL[type]}${index+1}`;
}

const makeDSLDate = (type: EventType, index: number, ref:DSLDateRef|undefined): string => {
    return `${makeDSLHead(type,index)}${typeof ref === "undefined" ? "" : ref}`;
}

const makeDSLOffset = (offset:number, unit:DSLTimeUnit):string => {
    return `${offset >= 0 ? ADD_SYMBOL : SUB_SYMBOL}${Math.abs(offset)}${unit}`;
}

const makeDSLAt = (atMinutes:number, atHours:number):string => {
    return `${AT_SYMBOL}${atHours.toString().padStart(2, "0")}${TIME_SEPARATOR}${atMinutes.toString().padStart(2, "0")}`;
}

export const updateDSL = (
    currentDSL: string[],
    dslIndex: number,
    activityType: EventType,
    activityIndex: number,
    courseType: EventType,
    courseIndex: number,
    courseDateRef: DSLDateRef | undefined,
    offsetValue: number,
    offsetUnit: DSLTimeUnit | undefined,
    atMinutes: number | undefined,
    atHours: number | undefined,

) => {
    currentDSL[HEAD_INDEX] = makeDSLHead(activityType, activityIndex);
    let dslOffset = "";
    if (typeof offsetUnit !== "undefined") {
        dslOffset = makeDSLOffset(offsetValue, offsetUnit!)
    }
    let dslAt = "";
    if (typeof atMinutes !== "undefined" && typeof atHours !== "undefined") {
        dslAt = makeDSLAt(atMinutes, atHours)
    }

    currentDSL[dslIndex] = `${makeDSLDate(courseType, courseIndex, courseDateRef)}${dslOffset}${dslAt}`;
    console.log(currentDSL)
};

export const validateDSL = (dsl:string[]):void => {
    if (typeof dsl.find((d:string)=> d.length ===0) !== "undefined") {
        throw new Error("Erreur DSL: nombre d'élément insuffisant");
    }
}

export const PLACEHOLDER_DSL = [makeDSLHead(EventType.Evaluation, 0),
    makeDSLDate(EventType.Seminar, 0, DSLDateRef.Start),
    makeDSLDate(EventType.Seminar, 1, DSLDateRef.Start)];

const parseDSLCourse = (dslCourse:string):DSLCourse => {
    let toParse = [...PLACEHOLDER_DSL];
    toParse[OPEN_INDEX] = dslCourse;
    return parseAndCast(unifyDSL(toParse))[0].open;
}
export const getDateType = (dsl:string):CourseType => {
    return  TYPE_MAP_DSL_TO_EVENT[parseDSLCourse(dsl).type] as CourseType;
}

export const getDateIndex = (dsl:string):number => {
    return  parseDSLCourse(dsl).i;
}

export const getDateRef = (dsl:string):DSLDateRef | undefined => {
    const parsedCourse = parseDSLCourse(dsl)
    return typeof parsedCourse.modifier === "undefined" ? undefined : parsedCourse.modifier as DSLDateRef;
}

export const getDateOffset = (dsl:string):number => {
    const parsedCourse = parseDSLCourse(dsl)
    let offset =0;
    if (typeof parsedCourse.time !== "undefined" && typeof parsedCourse.time.number !== "undefined") {
        offset = parsedCourse.time.number;
        if (typeof parsedCourse.time.modifier !== "undefined" && parsedCourse.time.modifier === SUB_SYMBOL) {
            offset *= -1;
        }
    }
    return offset;
}

export const getDateUnit = (dsl:string):DSLTimeUnit | undefined => {
    const parsedCourse = parseDSLCourse(dsl)
    let unit =undefined;
    if (typeof parsedCourse.time !== "undefined" && typeof parsedCourse.time.type !== "undefined") {
        unit = parsedCourse.time.type as DSLTimeUnit;
    }
    return unit;
}

export const getDateAt = (dsl:string):string|undefined => {
    const parsedCourse = parseDSLCourse(dsl)
    let at = undefined;
    if (typeof parsedCourse.time !== "undefined" && typeof parsedCourse.time.at !== "undefined") {
        at = parsedCourse.time.at;
    }
    return at;
}

