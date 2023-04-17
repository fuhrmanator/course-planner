import {
    ActivityEvent,
    ActivityType,
    CourseEvent,
    CoursEventDateGetter,
    EventType, EventWithName,
    SuggestionTypeMapConfig
} from "@/components/model/interfaces/courseEvent";
import {makeDSLClosestMatch} from "@/components/controller/util/dsl/dslOperations";
import {STATEMENT_SEPARATOR, TYPE_TO_STATEMENT_SIZE} from "@/components/model/ressource/dslRessource";

export const hasDueDate = (event:CourseEvent):boolean => {
    return typeof event.due !== "undefined";
}

export const hasCutoffDate = (event:CourseEvent):boolean => {
    return typeof event.cutoff !== "undefined";
}
/**
 * Sets the end property of a homework to the latest between due date and cutoff date.
 * @param event homework whose end will be adjusted.
 */
export const setEndIfHomework = (event:CourseEvent): Date => {
    if (event.type === EventType.Homework) {
        if (hasDueDate(event) && hasCutoffDate(event)) {
            event.end = new Date(Math.max(event.cutoff!.getTime(), event.due!.getTime()))
        } else if (hasDueDate(event)) {
            event.end = new Date(event.due!);
        } else {
            event.end = new Date(event.cutoff!);
        }
    }

    return event.end;
}
/**
 * Parses a string stored in the local store to a JS object representing an array of events.
 * @param toParse local store string.
 */
export const parseStoredEvents = (toParse:string): CourseEvent[] => {
    const parsed:CourseEvent[] = JSON.parse(toParse);
    for (let event of parsed) {
        parseStringDates(event);
    }
    return parsed;
}
/**
 * Parses a string stored in the local store to a JS object representing a single event.
 * @param toParse string representation of the event to parse.
 */
export const parseStoredEvent = (toParse: string): CourseEvent|undefined => {
    let parsed;
    if (toParse !== "undefined") {
        parsed = JSON.parse(toParse);
        parseStringDates(parsed);
    }
    return parsed
}
/**
 * Parses the dates the events back to the Date type. After being stored in the local store, events parsed with
 * JSON.parse will have strings for its dates. This assigns the correct type to these attributes.
 * @param event whose string dates will  be parsed into Date
 */
const parseStringDates = (event : CourseEvent) => {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    if (hasCutoffDate(event)) {
        event.cutoff = new Date(event.cutoff!)
    }
    if (hasDueDate(event)) {
        event.due = new Date(event.due!)
    }
    if (hasUnsavedState(event)) {
        parseStringDates(event.unsavedState as CourseEvent);
    }
}
/**
 * Finds and returns the earliest event based on the start property
 * @param events event candidates to be the earliest
 */
export const findEarliestEvent = (events: CourseEvent[]):CourseEvent => {
    return events.reduce((earliestEventYet:CourseEvent, event:CourseEvent) => {return earliestEventYet.start < event.start ? earliestEventYet : event});
}
/**
 * Creates and return or gets an unsaved state based on if the event already had an unsaved state. Unsaved states are used
 * to move an event without overriding its attributes. They can be cancelled or saved.
 * @param event to create or get unsaved state.
 */
export const getOrAddUnsavedState = (event: CourseEvent):CourseEvent => {
    let gotUnsavedState;
    if (hasUnsavedState(event)) {
        gotUnsavedState = event.unsavedState as CourseEvent;
    } else {
        gotUnsavedState = {...event};
        gotUnsavedState.start = new Date(gotUnsavedState.start);
        gotUnsavedState.end = new Date(gotUnsavedState.end);
        if (hasDueDate(gotUnsavedState)) {
            gotUnsavedState.due = new Date(gotUnsavedState.due!);
        }
        if (hasCutoffDate(gotUnsavedState)) {
            gotUnsavedState.cutoff = new Date(gotUnsavedState.cutoff!);
        }

        gotUnsavedState.dsl = event.dsl.slice();

        gotUnsavedState.unsavedState = null;
        event.unsavedState = gotUnsavedState;
    }

    return gotUnsavedState;
}
/**
 * Returns the parent of the unsaved state if it is present in the given events array
 * @param unsavedState child
 * @param events events that may contain the parent
 */
export const getUnsavedStateParent = (unsavedState: CourseEvent, events:CourseEvent[]):CourseEvent|undefined => {
    let parent = undefined;
    for (const event of events) {
        if (unsavedState.uid === event.uid) {
            parent = event;
            break;
        }
    }

    return parent;
}

/**
 * Returns an unsaved state if it has one and the parent if it dosen't.
 */
export const getUnsavedStateOrParent = (event: CourseEvent):CourseEvent => {
    let returned;
    if(hasUnsavedState(event)) {
        returned = event.unsavedState
    } else {
        returned = event;
    }
    return returned!;
}
/**
 * Saves all unsaved states of given events.
 * @param events whose unsaved states will be saved.
 */
export const saveAll = (events: CourseEvent[]):void => {
    for(let event of events) {
        saveState(event);
    }
}
/**
 * Cancels all unsaved states of given events.
 * @param events whoses unsaved states will be cancelled.
 */
export const cancelAllUnsavedState = (events: CourseEvent[]):void => {
    for(let event of events) {
        removeUnsavedState(event);
    }
}
/**
 * Removes the unsaved state from a CourseEvent object and returns it if it exists.
 * @param event - The CourseEvent object to remove the unsaved state from.
 * @returns The unsaved state, undefined if no unsaved state exists, or null if the event is null.
 */
export const removeUnsavedState = (event:CourseEvent): CourseEvent | undefined | null => {
    const unsavedState = event.unsavedState;
    event.unsavedState = undefined;
    return unsavedState;
}
/**
 * Returns an array of unsaved states from an array of CourseEvent objects.
 * @param events - The array of CourseEvent objects to retrieve unsaved states from.
 * @returns An array of unsaved states.
 */
export const getUnsavedStates = (events:CourseEvent[]):CourseEvent[] => {
    const unsavedStates = [];
    for (let event of events) {
        if (hasUnsavedState(event)) {
            unsavedStates.push(event.unsavedState!);
        }
    }
    return unsavedStates;
}
/**
 * Saves the unsaved state of a CourseEvent object to its properties if it has an unsaved state.
 * @param event - The CourseEvent object to save the unsaved state from.
 */
export const saveState = (event: CourseEvent):void => {
    if (hasUnsavedState(event)) {
        event.start = event.unsavedState!.start
        event.end = event.unsavedState!.end
        if (hasDueDate(event.unsavedState!)) {
            event.due = event.unsavedState!.due;
        }
        if (hasCutoffDate(event.unsavedState!)) {
            event.cutoff = event.unsavedState!.cutoff;
        }
        setEndIfHomework(event);
        event.unsavedState = undefined;
    }
}

export const hasUnsavedState= (event:CourseEvent):boolean => {
    return typeof event.unsavedState !== "undefined" && event.unsavedState !== null
}
export const isUnsavedState = (event:CourseEvent):boolean => {
    return typeof event.unsavedState !== "undefined" && event.unsavedState === null;
}
/**
 * Finds the index of the CourseEvent object in an array that is closest in start time to a given CourseEvent object.
 * @param event - The CourseEvent object to find the closest event to.
 * @param events - The array of CourseEvent objects to search.
 * @returns The index of the closest event in the array.
 */
export const findNearestEventIndex = (event: CourseEvent, events: CourseEvent[]):number => {
    let nearest = events.length -1;
    for (let i=0; i<events.length; i++) {

        if (event.start < events[i].start) {
            nearest = i - 1;
            break;
        }
    }
    return Math.max(nearest,0);
}
/**
 * Adds scheduling suggestions to a list of events. Suggestion recreates the structure of the activities relative to the old course on the
 * new course events.
 *
 * @param {ActivityEvent[]} eventsToSuggest - The list of activity events to suggest.
 * @param {CourseEvent[]} oldCourseEvents - The old list of course events to compare against.
 * @param {CourseEvent[]} newCourseEvents - The new list of course events to compare against.
 * @param {SuggestionTypeMapConfig} config - The configuration map that maps activity types to course types.
 * @return {void}
 */
export const addSuggestion = (eventsToSuggest: ActivityEvent[], oldCourseEvents: CourseEvent[], newCourseEvents: CourseEvent[], config: SuggestionTypeMapConfig):void => {
    sortEventsByOldestStart(oldCourseEvents)
    sortEventsByOldestStart(newCourseEvents)
    for (let typeFrom of getKeysAsType<ActivityType>(config)) {
        let oldCoursesWithTypeTo = oldCourseEvents.filter((event) => typeof config[typeFrom].find((t)=> t === event.type) !== "undefined");
        let newCoursesWithTypeTo = newCourseEvents.filter((event) => typeof config[typeFrom].find((t)=> t === event.type) !== "undefined");
        let eventToSuggestionWithTypeFrom = eventsToSuggest.filter((event) => event.type === typeFrom);
        if (oldCoursesWithTypeTo.length > 0 && newCoursesWithTypeTo.length > 0) {
            for (let i =0; i<eventToSuggestionWithTypeFrom.length; i++) {
                let event = eventToSuggestionWithTypeFrom[i];
                let courseNumber = Math.min(findNearestEventIndex(event, oldCoursesWithTypeTo), newCoursesWithTypeTo.length - 1);
                let eventSuggestion = getOrAddUnsavedState(event);
                eventSuggestion.start = new Date(newCoursesWithTypeTo[courseNumber].start.getTime() + event.start.getTime()- oldCoursesWithTypeTo[courseNumber].start.getTime());
                switch (typeFrom) {
                    case EventType.Homework:
                        if (typeof event.cutoff !== "undefined") {
                            eventSuggestion.cutoff = new Date(eventSuggestion.start!.getTime() + event.cutoff!.getTime() - event.start.getTime())
                        }
                        if (typeof event.due !== "undefined") {
                            eventSuggestion.due = new Date(eventSuggestion.start!.getTime() + event.due!.getTime() - event.start.getTime())
                        }
                        setEndIfHomework(eventSuggestion);
                        break;
                    case EventType.Evaluation:
                        eventSuggestion.end = new Date(eventSuggestion.start.getTime() + event.end.getTime() - event.start.getTime())
                        break
                    default:
                        console.log(`Warning : unsupported type ${typeFrom} for suggestion`);
                        break;

                }
                eventSuggestion.dsl = makeDSLClosestMatch(eventSuggestion, i, newCoursesWithTypeTo);
            }
        }
    }
}
/**
 * Sorts a list of course events by their oldest start date.
 *
 * @param {CourseEvent[]} events - The list of course events to sort.
 * @return {void}
 */
export const sortEventsByOldestStart = (events:CourseEvent[]):void => {
    events.sort((a,b) => a.start.getTime() - b.start.getTime());
}
/**
 * Sorts a list of course events with a specific type by their oldest start date.
 *
 * @param {CourseEvent[]} events - The list of course events to sort.
 * @param {EventType} type - The type of course events to filter and sort.
 * @return {CourseEvent[]} The sorted list of course events with the specified type.
 */
export const sortEventsWithTypeByOldestStart = (events:CourseEvent[], type:EventType):CourseEvent[] => {
    sortEventsByOldestStart(events);
    return events.filter((event)=>event.type === type);
}
/**
 * Returns an array of keys in a dictionary as an array of the specified type.
 *
 * @param {object} dict - The dictionary object whose keys are to be returned as an array.
 * @return {T[]} The array of keys as the specified type.
 */
export const getKeysAsType = <T extends number>(dict: {[keys in T]: any}):T[] => {
    return Object.keys(dict).map(e => parseInt(e)) as T[];
}

export const getDateOrThrow = (event:CourseEvent, getter: CoursEventDateGetter): Date => {
    const dateActivity = getter(event);
    if (typeof dateActivity === "undefined") {
        throw new Error("Bad activity date getter")
    }
    return dateActivity;
}

export const validateEvent = (event:CourseEvent):void => {
    if (event.start > event.end) {
        throw new Error("Le début est plus réçent que la fin")
    }
}

export const findEventIndexWithType = (event:CourseEvent, events:CourseEvent[]):number => {
    return sortEventsWithTypeByOldestStart(events, event.type).findIndex((e:CourseEvent) => e.uid === event.uid);
}

export const getEventWithTypeAndIndex = (type:EventType, index: number, events:CourseEvent[]):CourseEvent|undefined => {
    const sorted = sortEventsWithTypeByOldestStart(events, type);
    return index < sorted.length ? sorted[index] : undefined;
}
export const hasDSL = (event: CourseEvent): boolean => {
    for (const dsl of event.dsl) {
        if (dsl.length > 0) {
            return true;
        }
    }
    return false;
}
export const getDSLAtIndex = (event:CourseEvent,  dslIndex:number): string|undefined => {
    let dsl = undefined;

    if (event.dsl[dslIndex].length > 0) {
        dsl = event.dsl[dslIndex];
    } else if (hasUnsavedState(event) && event.unsavedState!.dsl[dslIndex].length > 0) {
        dsl = event.unsavedState!.dsl[dslIndex];
    }

    return dsl;
}



