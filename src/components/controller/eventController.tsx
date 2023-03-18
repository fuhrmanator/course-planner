import React, {useState, useContext, createContext} from 'react';
import fetchCourseICAL from './util/fetchOperations'
import {parseICALEvents} from './util/icalInterpreter';
import { EventModelContext } from '@/components/model/eventModel';
import { applyChangesToArchive, extractData, makeEvents, parseActivities, zipData } from './util/mbz/mbzInterpreter';
import {addUniqueEvents, findEarliestEvent} from './util/eventsOperations';
import MBZArchive from '../model/interfaces/archive/MBZArchive';
import {CalEvent} from "@/components/model/interfaces/events/calEvent";


type EventControllerContextProps = {
    notifyCourseFormSubmit : (code: string, group: number, year: number, semester:number) => void;
    notifyClearCal : () => void;
    notifyEventSelected: (event:CalEvent) => void;
    notifyMBZSubmitted : (file: File) => void;
    notifyMBZDownload : (oldURL: string) => string;
}

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
    children: React.ReactNode;
}

export const EventController: React.FC<CalControllerProps> = ({children}) => {
    const {courseEvents, setCourseEvents, MBZEvents, setMBZEvents, setSelectedEvent} = useContext(EventModelContext);
    const [mbzData, setMVZData] = useState<MBZArchive>(new MBZArchive());
    

    const setSelectedToEarliest = (events: CalEvent[]):void => {
        if (events.length > 0) {
            setSelectedEvent(findEarliestEvent(events));
        }
    }

    const notifyCourseFormSubmit = async (code: string, group: number, year: number, semester:number) => {
        const textData = await fetchCourseICAL(code, group, year, semester);
        const newEvents = parseICALEvents(textData);
        addUniqueEvents(newEvents, courseEvents);
        setCourseEvents({...courseEvents});
        setSelectedToEarliest(newEvents);
    }

    const notifyClearCal = () => {
        setCourseEvents({});
        setMBZEvents({});
    }

    const notifyMBZSubmitted = async (file: File) => {
        const unorderedData = await extractData(file);
        const mbzArchive = parseActivities(unorderedData);
        setMVZData(mbzArchive);
        const newMBZEvents = makeEvents(mbzArchive);
        addUniqueEvents(newMBZEvents, MBZEvents);
        setMBZEvents({...MBZEvents});
        setSelectedToEarliest(newMBZEvents);
    }

    const notifyMBZDownload = (oldURL: string) => {
        URL.revokeObjectURL(oldURL);
        applyChangesToArchive(mbzData, Object.values(MBZEvents));
        const file = new Blob([zipData(mbzData)], { type: 'application/octet-stream' });        
        return URL.createObjectURL(file);
    }

    const notifyEventSelected = (event:CalEvent) => {
        setSelectedEvent(event);
    }

    return (
        <EventControllerContext.Provider value={{notifyCourseFormSubmit, notifyClearCal, notifyEventSelected, notifyMBZSubmitted, notifyMBZDownload}}>
            {children}
        </EventControllerContext.Provider>
    );
}