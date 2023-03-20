
import {CourseEvent, EventTypeColour} from "@/components/model/interfaces/events/courseEvent";

export const findEarliestEvent = (events: CourseEvent[]):CourseEvent => {
    return events.reduce((earliestEventYet:CourseEvent, event:CourseEvent) => {return earliestEventYet.start < event.start ? earliestEventYet : event});
}

export const setEventsColour = (colours:EventTypeColour[], events: CourseEvent[]) : void => {
    for (let colour of colours) {
        for (let event of events) {
            if (event.type === colour.type) {
                event.colour = colour.colour
            }
        }
    }
}

export const getKeysAsType = <T extends number>(dict: {[keys in T]: any}):T[] => {
    return Object.keys(dict).map(e => parseInt(e)) as T[];
}
