import {CourseEvent, EventType} from '@/components/model/interfaces/courseEvent'
const ical = require('ical.js');

function icalToEvent(ical:any): CourseEvent | undefined {
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

export const parseICALEvents = (icalData: string):CourseEvent[] => {
    const baseComponent = new ical.Component(ical.parse(icalData));
    const vEvents = baseComponent.getAllSubcomponents('vevent');
    const calEvents = vEvents.map((vEvent: any) => icalToEvent(vEvent)).filter((event:CourseEvent) => {return typeof event !== 'undefined'});

    return calEvents;
}

function iCalCategoryToType(icalCategory: string): EventType|undefined {
    let type: EventType|undefined;
    switch (icalCategory) {
        case "Labo": {
            type= EventType.Laboratories
            break;
        }
        case "C": {
            type= EventType.Seminar
            break;
        }
        case "TP": {
            type= EventType.Practica
            break;
        }
        default: { 
            console.log("Type ", icalCategory, " unsupported")
            break; 
         } 
    }
    return type;
}