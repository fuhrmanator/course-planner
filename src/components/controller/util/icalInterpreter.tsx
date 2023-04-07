import {CourseEvent, EventType} from '@/components/model/interfaces/courseEvent'
const ical = require('ical.js');
/**
 Converts an iCal event to a CourseEvent object
 @param ical - iCal event to convert
 @returns a CourseEvent object or undefined if the category is unsupported
 */
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
/**

 Parses an iCal string and returns an array of CourseEvent objects

 @param icalData - string containing iCal data to parse
 @returns an array of CourseEvent objects
 */
export const parseICALEvents = (icalData: string):CourseEvent[] => {
    const baseComponent = new ical.Component(ical.parse(icalData));
    const vEvents = baseComponent.getAllSubcomponents('vevent');
    const calEvents = vEvents.map((vEvent: any) => icalToEvent(vEvent)).filter((event:CourseEvent) => {return typeof event !== 'undefined'});

    return calEvents;
}
/**

 Converts an iCal category string to an EventType enum value
 @param icalCategory - category string to convert
 @returns an EventType enum value or undefined if the category is unsupported
 */
function iCalCategoryToType(icalCategory: string): EventType|undefined {
    let type: EventType|undefined;
    switch (icalCategory) {
        case "Labo": {
            type= EventType.Laboratory
            break;
        }
        case "C": {
            type= EventType.Seminar
            break;
        }
        case "TP": {
            type= EventType.Practicum
            break;
        }
        default: { 
            console.log("Type ", icalCategory, " unsupported")
            break; 
         } 
    }
    return type;
}