import {CalEvent, CalEventType} from '@/components/model/interfaces/events/calEvent'
const ical = require('ical.js');

function icalToEvent(ical:any): CalEvent | undefined {
    const type = iCalCategoryToType(ical.getFirstPropertyValue('categories').trim());
    if (typeof type === 'undefined') {
        return;
    }
    return {
        start: ical.getFirstPropertyValue('dtstart').toJSDate(),
        end: ical.getFirstPropertyValue('dtend').toJSDate(),
        title: ical.getFirstPropertyValue('summary').trim(),
        type: type,
        uid: ical.getFirstPropertyValue('uid').trim()
    }
}

export const parseICALEvents = (icalData: string):CalEvent[] => {
    const baseComponent = new ical.Component(ical.parse(icalData));
    const vEvents = baseComponent.getAllSubcomponents('vevent');
    const calEvents = vEvents.map((vEvent: any) => icalToEvent(vEvent)).filter((event:CalEvent) => {return typeof event !== 'undefined'});

    return calEvents;
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
        case "TP": {
            type= CalEventType.Practica
            break;
        }
        default: { 
            console.log("Type ", icalCategory, " unsupported")
            break; 
         } 
    }
    return type;
}