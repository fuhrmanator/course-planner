import { EventDict, MBZEventDict } from '@/components/model/eventModel';

import { MBZEvent} from '@/components/model/interfaces/events/mbzEvent';

import { CalEvent } from '@/components/model/interfaces/events/calEvent';

export const updateEventDates = (newStartDate: Date, newEndDate: Date, events: MBZEventDict, eventId:string): MBZEventDict => {
  const updatedEvents: MBZEventDict = {};

  Object.values(events).forEach((event) => {
    if (event.uid === eventId) {
      const updatedEvent: MBZEvent = {
        ...event,
        start: new Date(newStartDate.getTime() + (event.start.getTime() - new Date(event.start).setHours(0,0,0,0))),
        end: new Date(newEndDate.getTime() + (event.end.getTime() - new Date(event.end).setHours(0,0,0,0))),
      };
      updatedEvents[eventId] = updatedEvent;
    } else {
      console.log("le event id est "+eventId)
      //return (console.log("aucun evenment du mbz est change car le uid est pas egale dans les events")+ "voir la console");
    }
  });

  return updatedEvents;
};
/*
export const updateEventDates = ( newStartDate: Date, newEndDate: Date, eventsToUpdate: CalEvent[]): CalEvent[] => {
    const updatedEvents = eventsToUpdate.map(event => ({
      ...event,
      start: newStartDate,
      end: newEndDate,
    }));
  
    const updatedEventDict = updatedEvents.reduce((eventDict, event) => ({
      ...eventDict,
      [event.uid]: event,
    }), []);
  
    return updatedEventDict;
  };*/