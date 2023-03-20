import React, {useState, useContext, createContext} from 'react';
import fetchCourseICAL from './util/fetchOperations'
import {parseICALEvents} from './util/icalInterpreter';
import { EventModelContext } from '@/components/model/eventModel';
import { applyChangesToArchive, extractData, makeEvents, parseActivities, zipData } from './util/mbz/mbzInterpreter';
import { findEarliestEvent } from './util/eventsOperations';
import MBZArchive from '../model/interfaces/archive/MBZArchive';
import {CourseEvent, EventType} from "@/components/model/interfaces/events/courseEvent";
import {ActivityEvent} from "@/components/model/interfaces/events/activityEvent";


type EventControllerContextProps = {
    notifyCourseFormSubmit : (code: string, group: number, year: number, semester:number, isOldCourse:boolean) => void;
    notifyClearCal : () => void;
    notifyEventSelected: (event:CourseEvent) => void;
    notifyMBZSubmitted : (file: File) => void;
    notifyMBZDownload : (oldURL: string) => string;
    notifyEventColourUpdated: (type: EventType, newColour: string) => void;
}

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
    children: React.ReactNode;
}

export const EventController: React.FC<CalControllerProps> = ({children}) => {
    const {oldCourseEvents, setOldCourseEvents, newCourseEvents, setNewCourseEvents, activityEvents, setActivityEvents, setSelectedEvent, eventTypeColour, setEventTypeColour} = useContext(EventModelContext);
    const [mbzData, setMVZData] = useState<MBZArchive>(new MBZArchive());
    

    const setSelectedToEarliest = (events: CourseEvent[]):void => {
        if (events.length > 0) {
            setSelectedEvent(findEarliestEvent(events));
        }
    }

    const setEventsIfEmpty = (events:CourseEvent[], addTo: CourseEvent[], callback: (events: any)=>void):void => {
        if (addTo.length === 0) {
            setEvents(events, callback);
        }
    }

    const setEvents = (events: CourseEvent[], setCallback: (events: CourseEvent[])=>void) => {
        setCallback(events);
        setSelectedToEarliest(events);
    }

    const notifyCourseFormSubmit = async (code: string, group: number, year: number, semester:number, isOldCourse:boolean) => {
        const textData = await fetchCourseICAL(code, group, year, semester);
        const newEvents = parseICALEvents(textData);
        if (isOldCourse) {
            setEventsIfEmpty(newEvents, oldCourseEvents, setOldCourseEvents);
        } else {
            setEventsIfEmpty(newEvents, newCourseEvents, setNewCourseEvents);
        }
    }

    const notifyClearCal = () => {
        setNewCourseEvents([]);
        setOldCourseEvents([]);
        setActivityEvents([]);
    }

    const notifyMBZSubmitted = async (file: File) => {
        const unorderedData = await extractData(file);
        const mbzArchive = parseActivities(unorderedData);
        setMVZData(mbzArchive);
        const newMBZEvents:ActivityEvent[] = makeEvents(mbzArchive);
        setEventsIfEmpty(newMBZEvents, activityEvents, setActivityEvents);
    }

    const notifyMBZDownload = (oldURL: string) => {
        URL.revokeObjectURL(oldURL);
        applyChangesToArchive(mbzData, Object.values(activityEvents));
        const file = new Blob([zipData(mbzData)], { type: 'application/octet-stream' });        
        return URL.createObjectURL(file);
    }

    const notifyEventSelected = (event:CourseEvent) => {
        setSelectedEvent(event);
    }

    const notifyEventColourUpdated = (type: EventType, newColour: string) => {
        for (let event of eventTypeColour) {
            if (event.type === type) {
                event.colour = newColour;
                break;
            }
        }
        setEventTypeColour([...eventTypeColour]);
    };

    return (
        <EventControllerContext.Provider value={{notifyCourseFormSubmit, notifyClearCal, notifyEventSelected, notifyMBZSubmitted, notifyMBZDownload, notifyEventColourUpdated}}>
            {children}
        </EventControllerContext.Provider>
    );
}