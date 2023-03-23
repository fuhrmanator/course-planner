
import {
    ActivityEvent, ActivityType,
    CourseEvent,
    EventType,
    SuggestionConfigDict
} from "@/components/model/interfaces/courseEvent";


export const parseStoredEvents = (toParse:string): CourseEvent[] => {
    const parsed:CourseEvent[] = JSON.parse(toParse);
    for (let event of parsed) {
        parseStringDates(event);
    }
    return parsed;
}
export const parseStoredEvent = (toParse: string): CourseEvent|undefined => {
    let parsed;
    if (toParse !== "undefined") {
        parsed = JSON.parse(toParse);
        parseStringDates(parsed);
    }
    return parsed
}

const parseStringDates = (event : CourseEvent) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    if (hasUnsavedState(event)) {
        parseStringDates(event.unsavedState as CourseEvent);
    }
}

export const findEarliestEvent = (events: CourseEvent[]):CourseEvent => {
    return events.reduce((earliestEventYet:CourseEvent, event:CourseEvent) => {return earliestEventYet.start < event.start ? earliestEventYet : event});
}

export const getOrAddUnsavedState = (event: CourseEvent):CourseEvent => {
    let gotUnsavedState;
    if (hasUnsavedState(event)) {
        gotUnsavedState = event.unsavedState as CourseEvent;
    } else {
        gotUnsavedState = {...event}
        gotUnsavedState.unsavedState = null;
        event.unsavedState = gotUnsavedState;
    }

    return gotUnsavedState;
}

export const saveAll = (events: CourseEvent[]):void => {
    for(let event of events) {
        saveState(event);
    }
}

export const cancelAllUnsavedState = (events: CourseEvent[]):void => {
    for(let event of events) {
        removeUnsavedState(event);
    }
}
export const removeUnsavedState = (event:CourseEvent): CourseEvent | undefined | null => {
    const unsavedState = event.unsavedState;
    event.unsavedState = undefined;
    return unsavedState;
}

export const getUnsavedStates = (events:CourseEvent[]):CourseEvent[] => {
    const unsavedStates = [];
    for (let event of events) {
        if (hasUnsavedState(event)) {
            unsavedStates.push(event.unsavedState!);
        }
    }
    return unsavedStates;
}
export const saveState = (event: CourseEvent):void => {
    if (hasUnsavedState(event)) {
        event.start = event.unsavedState!.start
        event.end = event.unsavedState!.end
        event.unsavedState = undefined;
    }
}

export const hasUnsavedState= (event:CourseEvent):boolean => {
    return typeof event.unsavedState !== "undefined" && event.unsavedState !== null
}
export const isUnsavedState = (event:CourseEvent):boolean => {
    return typeof event.unsavedState !== "undefined" && event.unsavedState === null;
}

export const findNearestEventIndex = (event: CourseEvent, events: CourseEvent[]):number => {
    let nearest = events.length -1;
    for (let i=0; i<events.length; i++) {
        if (event.start <= events[i].start) {
            nearest = i;
            break;
        }
    }
    return nearest;
}
//Le problème de dimension arrive dans avec les deux ordres de triage.
// Seulement, avec l'ordre inverse il faut en plus de vérifier le suprplus, décaler l'index.
// Addapte donc le code en ordre naturel
export const addSuggestion = (eventsToSuggest: ActivityEvent[], oldCourseEvents: CourseEvent[], newCourseEvents: CourseEvent[], config: SuggestionConfigDict):void => {
    sortEventsByOldestStart(oldCourseEvents)
    sortEventsByOldestStart(newCourseEvents)
    for (let typeFrom of getKeysAsType<ActivityType>(config)) {
        let oldCoursesWithTypeTo = oldCourseEvents.filter((event) => event.type === config[typeFrom]);
        let newCoursesWithTypeTo = newCourseEvents.filter((event) => event.type === config[typeFrom]);
        let eventToSuggestionWithTypeFrom = eventsToSuggest.filter((event) => event.type === typeFrom);
        if (oldCoursesWithTypeTo.length > 0 && newCoursesWithTypeTo.length > 0) {
            for (let event of eventToSuggestionWithTypeFrom) {
                let courseNumber = Math.min(findNearestEventIndex(event, oldCoursesWithTypeTo), newCoursesWithTypeTo.length - 1);
                let eventSuggestion = getOrAddUnsavedState(event);
                eventSuggestion.start = new Date(newCoursesWithTypeTo[courseNumber].start.getTime() + event.start.getTime()- oldCoursesWithTypeTo[courseNumber].start.getTime());
                eventSuggestion.end = new Date(eventSuggestion.start.getTime() + event.end.getTime() - event.start.getTime())
            }
        }
    }
}

export const sortEventsByOldestStart = (events:CourseEvent[]):void => {
    events.sort((a,b) =>  a.start.getTime() - b.start.getTime());
}

export const getKeysAsType = <T extends number>(dict: {[keys in T]: any}):T[] => {
    return Object.keys(dict).map(e => parseInt(e)) as T[];
}
