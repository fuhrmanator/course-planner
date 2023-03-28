import {CourseEvent, EventType} from "@/components/model/interfaces/courseEvent";
import parser from "./grammar/dsl"
import {
    getOrAddUnsavedState,
    setHomeworkEnd,
    sortEventsWithTypeByOldestStart
} from "@/components/controller/util/eventsOperations";

interface DSLObject {
    type:string,
    i:number
}

interface DSLActivity extends DSLObject {
    open:DSLCourse,
    close?:DSLCourse,
    due?:DSLCourse,
    cutoff?:DSLCourse
}

interface DSLCourse extends DSLObject {
    modifier?: string
    time?: DSLTime
}

interface DSLTime {
    type?: string,
    at?:string,
    number?:number,
    modifier?:string
}

const TypeMapDSLtoEvent: {[key: string]: EventType} = {
    "P": EventType.Practicum,
    "L": EventType.Laboratory,
    "S": EventType.Seminar,
    "Q": EventType.Evaluation,
    "E": EventType.Evaluation,
    "H": EventType.Homework
}

const DSLTimeTypeToMS: {[key:string]: number} = {
    "w": 6.048e+8,
    "d": 8.64e+7,
    "h": 3.6e+6,
    "m": 60000
}

const TIME_SEPARATOR = ":";
const ADD_SYMBOL = "+";
const SUB_SYMBOL = "-";
const START_SYMBOL = "S";
const END_SYMBOL = "F";

const recreateDSL = (node: any): any => {
    switch (node.type) {
        case 'Q':
            return `Q${node.i} ${recreateDSL(node.open)} ${recreateDSL(node.close)}`;
        case 'E':
            return `E${node.i} ${recreateDSL(node.open)}`;
        case 'S':
        case 'L':
        case 'P':
            const time = node.time ?
                node.time.modifier.concat(
                    node.time.number,
                    node.time.type,
                    node.time.at ? '@' + node.time.at : ''): '';
            return `${node.type}${node.i}${node.modifier ? node.modifier : ''}${time}`;
        case 'H':
            return `H${node.i} ${recreateDSL(node.open)} ${recreateDSL(node.due)} ${recreateDSL(node.cutoff)}`;
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
            if (dsl.time.type in DSLTimeTypeToMS) {
                const offset = DSLTimeTypeToMS[dsl.time.type] * dsl.time.number!
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
        if (dsl.type in TypeMapDSLtoEvent) {
            let sortedActivitiesWithType = sortEventsWithTypeByOldestStart(events, TypeMapDSLtoEvent[dsl.type])
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
