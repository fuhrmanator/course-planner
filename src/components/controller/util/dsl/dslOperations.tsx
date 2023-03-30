import {CourseEvent, EventType} from "@/components/model/interfaces/courseEvent";
import parser from "./grammar/dsl"
import {
    getOrAddUnsavedState,
    hasCutoffDate,
    hasDueDate,
    setHomeworkEnd,
    sortEventsWithTypeByOldestStart
} from "@/components/controller/util/eventsOperations";
import {
    ADD_SYMBOL,
    AT_SYMBOL,
    COMMENT_SYMBOL,
    DSL_TIME_UNIT_TO_MS,
    END_SYMBOL,
    MS_DSL_UNIT_SORTED_BY_DURATION,
    START_SYMBOL,
    SUB_SYMBOL,
    TIME_SEPARATOR,
    TYPE_MAP_DSL_TO_EVENT,
    TYPE_MAP_EVENT_TO_DSL
} from "@/components/model/ressource/dslRessource";
import {DSLActivity, DSLCourse, DSLObject, DSLTimeType} from "@/components/model/interfaces/dsl";
import {all} from "deepmerge";


const dateOffsetAsDSL = (ref: Date, offset: Date, atRecursion:boolean = false): string => {

    const operationSymbol = ref > offset ? SUB_SYMBOL : ADD_SYMBOL
    const offsetToRepresent = Math.abs(offset.getTime()-ref.getTime());
    let result = "";
    if (offsetToRepresent !== 0) {
        let unitToUse = MS_DSL_UNIT_SORTED_BY_DURATION.find((dslUnit:DSLTimeType) => offsetToRepresent % dslUnit.value === 0);
        if (typeof unitToUse === "undefined") {
            if (atRecursion) { // prevents infinite recursion due to precision
                throw new Error(`No DSL units can accurately represent the duration between ${ref} and ${offset}`)
            }
            const hours = offset.getHours();
            const minutes = offset.getMinutes();
            const truncatedOffset = new Date(offset)
            truncatedOffset.setHours(0)
            truncatedOffset.setMinutes(0)
            const truncatedResult = dateOffsetAsDSL(ref,truncatedOffset, true);
            result = `${truncatedResult}${AT_SYMBOL}${hours}${TIME_SEPARATOR}${minutes}`
        } else {
            const numberOfUnitToUse = offsetToRepresent / unitToUse.value;
            result = `${operationSymbol}${numberOfUnitToUse}${unitToUse.symbol}`
        }
    }


    return result;
}

const makeDSLRelativeToClosestDate = (ref:Date, sortedEvents:CourseEvent[]):string => {
    const allPossibleClosestDates = sortedEvents.flatMap((event:CourseEvent)=>[event.start, event.end]);
    let closestIndex =-1;
    let closestValue = Number.MAX_VALUE;
    for (let i=0;i <allPossibleClosestDates.length;i++) {
        let currentValue = Math.abs(allPossibleClosestDates[i].getTime() - ref.getTime())
        if (currentValue<closestValue) {
            closestValue = currentValue;
            closestIndex = i;
        }
    }
    const closestEventIndex = Math.floor(closestIndex / 2) ;
    const closestDate = allPossibleClosestDates[closestIndex];
    const closestDSLModifier = closestIndex % 2 ==0 ? START_SYMBOL : END_SYMBOL;
    const closestOffset = dateOffsetAsDSL(closestDate, ref);
    return `${closestEventIndex + 1}${TYPE_MAP_EVENT_TO_DSL[sortedEvents[closestEventIndex].type]}${closestDSLModifier}${closestOffset}`
}
export const makeDSLClosestMatch = (event:CourseEvent, eventIndex:number, sortedEvents:CourseEvent[]):string => {

    const openDSL = makeDSLRelativeToClosestDate(event.start, sortedEvents);
    let dueDSL = "";
    if (hasDueDate(event)) {
        dueDSL = dueDSL.concat(" ", makeDSLRelativeToClosestDate(event.due!, sortedEvents));
    }
    let cutoffDSL = "";
    if (hasCutoffDate(event)) {
        cutoffDSL = cutoffDSL.concat(" ", makeDSLRelativeToClosestDate(event.cutoff!, sortedEvents));
    }
    let closeDSL = "";
    if (event.type === EventType.Evaluation) {
        closeDSL = closeDSL.concat(" ", makeDSLRelativeToClosestDate(event.end, sortedEvents));
    }

    return `${TYPE_MAP_EVENT_TO_DSL[event.type]}${eventIndex + 1} ${openDSL}${dueDSL}${cutoffDSL}${closeDSL}`
}

const recreateDSL = (node: any): any => {
    switch (node.type) {
        case 'Quiz':
            return `${node.type}${node.i} ${recreateDSL(node.open)} ${recreateDSL(node.close)}`;
        case 'Exam':
            return `${node.type}${node.i} ${recreateDSL(node.open)}`;
        case 'Seminar':
        case 'Laboratory':
        case 'Practicum':
            const time = node.time ?
                node.time.modifier.concat(
                    node.time.number,
                    node.time.type,
                    node.time.at ? '@' + node.time.at : ''): '';
            return `${node.type}${node.i}${node.modifier ? node.modifier : ''}${time}`;
        case 'Homework':
            return `${node.type}${node.i} ${recreateDSL(node.open)} ${recreateDSL(node.due)} ${recreateDSL(node.cutoff)}`;
        default:
            throw new Error(`Unknown node type ${node.type}`);
    }
};

const getDateReferenceByDSL = (dsl:DSLCourse, event:CourseEvent):Date => {
    let date;
    if (typeof dsl.modifier === "undefined" || dsl.modifier === START_SYMBOL) {
        date = new Date(event.start)
    } else if(dsl.modifier === END_SYMBOL) {
        date = new Date(event.end)
    } else {
        throw Error("Bad course reference for "+ JSON.stringify(dsl))
    }
    return date;
}


const parseDSLTimeToDate= (dsl: DSLCourse, relativeTo: Date):Date => {
    let newDate =new Date(relativeTo);
    if (typeof dsl.time !== "undefined") {
        if (typeof dsl.time.at !== "undefined") {
            const timeParts = dsl.time.at.split(TIME_SEPARATOR);
            newDate.setHours(parseInt(timeParts[0]));
            newDate.setMinutes(parseInt(timeParts[1]));
        }
        if (typeof dsl.time.type !== "undefined") {
            // having a type guarantees having a number and modifier
            if (dsl.time.type in DSL_TIME_UNIT_TO_MS) {
                const offset = DSL_TIME_UNIT_TO_MS[dsl.time.type] * dsl.time.number!
                switch (dsl.time.modifier!) {
                    case ADD_SYMBOL:
                        newDate = new Date(newDate.getTime() + offset);
                        break;
                    case SUB_SYMBOL:
                        newDate = new Date(newDate.getTime() - offset);
                        break;
                    default:
                        console.log("Warning:",dsl.time.modifier,"is a unsupported time operation format")
                        break;
                }
        }
        } else {
            console.log("Warning:",dsl.time.type,"is a unsupported time modifier format")
        }
    }
    return newDate;
}
const getEventReferencedByDSL = (dsl : DSLObject|undefined, events:CourseEvent[]): CourseEvent|undefined => {
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

export const hasDSL= (event:CourseEvent): boolean => {
    return typeof event.dsl !== "undefined"
}
export const getTitleAsComment= (event:CourseEvent): string => {
    return `${COMMENT_SYMBOL}${event.title}`;
}


export const parseDSL= (dsl:string, activities:CourseEvent[], newCourseEvents:CourseEvent[]):void => {
    const rawParsed: any[] = parser.parse(dsl) as any[];
    const parsedDSL: DSLActivity[] = rawParsed[1] as DSLActivity[];
    let referencedCourse;
    for (const parsedActivity of parsedDSL) {
        let activityToMove = getEventReferencedByDSL(parsedActivity, activities);
        if (typeof activityToMove !== "undefined") {
            activityToMove = getOrAddUnsavedState(activityToMove);
            activityToMove.dsl = recreateDSL(parsedActivity);
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

            setHomeworkEnd(activityToMove)
        }
    }
}
