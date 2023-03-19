import { EventDict } from "@/components/model/eventModel";
import { CalEvent } from "@/components/model/interfaces/events/calEvent";

export const findEarliestEvent = (events: CalEvent[]):CalEvent => {
    return events.reduce((earliestEventYet:CalEvent, event:CalEvent) => {return earliestEventYet.start < event.start ? earliestEventYet : event});
}

export const addUniqueEvents = (events: CalEvent[], addToCollection: EventDict):void => {
    for (let event of events) {
        if (!(event.uid in addToCollection)) {
            addToCollection[event.uid] = event;
        }
    }
}