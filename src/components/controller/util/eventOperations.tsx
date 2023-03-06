import { EventDict } from '@/components/model/eventModel';
import {CalEvent, CalEventType} from '@/components/model/interfaces/events/calEvent'
const ical = require('ical.js');

export const mapICALtoEvent = (icalData: string):CalEvent[] => {
    const baseComponent = new ical.Component(ical.parse(icalData));
    const vEvents = baseComponent.getAllSubcomponents('vevent');
    const calEvents = vEvents.map((vEvent: any) => {
        return {
            start: vEvent.getFirstPropertyValue('dtstart').toJSDate(),
            end: vEvent.getFirstPropertyValue('dtend').toJSDate(),
            title: vEvent.getFirstPropertyValue('summary').trim(),
            type: iCalCategoryToType(vEvent.getFirstPropertyValue('categories').trim()),
            uid: vEvent.getFirstPropertyValue('uid').trim()
        }
    }).filter((event:CalEvent) => {return event.type != undefined});

    return calEvents;
}   

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
export const updateSameEvents = (events: CalEvent[], addToCollection: EventDict):void => {
    for (let event of events) {
        if ((event.uid in addToCollection)) {
            addToCollection[event.uid] = event;
        }
    }
}

function iCalCategoryToType(icalCategory: string): CalEventType|undefined {
    let type: CalEventType|undefined;
    switch (icalCategory) {
        case "Labo": {
            type= CalEventType.Laboratories
            break;
        }
        case "C": {
            type= CalEventType.Seminar
            break;
        }
        default: { 
            console.log("Type ", icalCategory, " unsupported")
            break; 
         } 
    }
    return type;
}