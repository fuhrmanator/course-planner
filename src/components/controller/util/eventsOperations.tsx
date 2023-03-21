
import {
    ActivityEvent, ActivityType,
    CourseEvent,
    SuggestionConfigDict
} from "@/components/model/interfaces/courseEvent";


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
        console.log(event.unsavedState)
        removeUnsavedState(event);
        console.log(event.unsavedState)
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

export const addSuggestion = (eventsToSuggest: ActivityEvent[], oldCourseEvents: CourseEvent[], newCourseEvents: CourseEvent[], config: SuggestionConfigDict):void => {
    sortEvents(oldCourseEvents)
    sortEvents(newCourseEvents)
    for (let typeFrom of getKeysAsType<ActivityType>(config)) {
        let oldCoursesWithTypeTo = oldCourseEvents.filter((event) => event.type === config[typeFrom]);
        let newCoursesWithTypeTo = newCourseEvents.filter((event) => event.type === config[typeFrom]);
        let eventToSuggestionWithTypeFrom = eventsToSuggest.filter((event) => event.type === typeFrom);
        if (oldCoursesWithTypeTo.length > 0) {
            for (let event of eventToSuggestionWithTypeFrom) {
                let oldCourseIndex = findNearestEventIndex(event, oldCoursesWithTypeTo);
                let eventSuggestion = getOrAddUnsavedState(event);
                eventSuggestion.start = new Date(newCoursesWithTypeTo[oldCourseIndex].start.getTime() + event.start.getTime()- oldCoursesWithTypeTo[oldCourseIndex].start.getTime());
                eventSuggestion.end = new Date(eventSuggestion.start.getTime() + event.end.getTime() - event.start.getTime())
            }
        }
    }
}

export const sortEvents = (events:CourseEvent[]):void => {
    events.sort((a,b) => a.start.getTime() - b.start.getTime());
}

export const getKeysAsType = <T extends number>(dict: {[keys in T]: any}):T[] => {
    return Object.keys(dict).map(e => parseInt(e)) as T[];
}
