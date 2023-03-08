import { EventDict, MBZEventDict } from "@/components/model/eventModel";
import { CalEvent } from "@/components/model/interfaces/events/calEvent";
import { MBZEvent } from "@/components/model/interfaces/events/mbzEvent";

export const findEarliestEventDate = (events: CalEvent[]):Date => {
    const eventStart = events.map((event:CalEvent)=>{return event.start});
    return eventStart.reduce((earliestEventYet:Date, event:Date) => {return earliestEventYet < event ? earliestEventYet : event}, new Date());
}

export const addUniqueEvents = (events: CalEvent[], addToCollection: EventDict):void => {
    for (let event of events) {
        if (!(event.uid in addToCollection)) {
            addToCollection[event.uid] = event;
        }
    }
}

export const removeEvent = (event: any, courseEvents: EventDict, MBZEvents: MBZEventDict) => {
    const updatedCourseEvents: EventDict = {...courseEvents};
    const updatedMBZEvents: MBZEventDict = {...MBZEvents};
  
    if (updatedCourseEvents[event.uid]) {
      delete updatedCourseEvents[event.uid];
    }
    
    if (updatedMBZEvents[event.uid]) {
      delete updatedMBZEvents[event.uid];
    }
  
    return {
      courseEvents: updatedCourseEvents,
      MBZEvents: updatedMBZEvents,
    };
  };
  

export const addUniqueMBZEvents = (events: MBZEvent[], addToCollection: EventDict):void => {
    for (let event of events) {
        if (!(event.uid in addToCollection)) {
            addToCollection[event.uid] = event;
        }
    }
}
