import React, {useState, useContext, createContext} from 'react';
import fetchCourseICAL from './util/fetchOperations'
import {parseICALEvents} from './util/icalInterpreter';
import { EventModelContext } from '@/components/model/eventModel';
import { extractData, makeEvents, parseActivities, zipData } from './util/mbzInterpreter';
import { addUniqueEvents } from './util/eventsOperations';
import MBZArchive from '../model/interfaces/archive/MBZArchive';


type EventControllerContextProps = {
    notifyCourseFormSubmit : (code: string, group: number, year: number, semester:number) => void;
    notifyClearCal : () => void;
    notifyMBZSubmited : (file: File) => void;
    notifyMBZDownload : (oldURL: string) => string;
}

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
    children: React.ReactNode;
}

export const EventController: React.FC<CalControllerProps> = ({children}) => {
    const {courseEvents, setCourseEvents, MBZEvents, setMBZEvents} = useContext(EventModelContext);
    const [mbzData, setMVZData] = useState<MBZArchive>(new MBZArchive());
    
    
    const notifyCourseFormSubmit = async (code: string, group: number, year: number, semester:number) => {
        const textData = await fetchCourseICAL(code, group, year, semester);
        const newEvents = parseICALEvents(textData);
        addUniqueEvents(newEvents, courseEvents);
        setCourseEvents({...courseEvents});
    }

    const notifyClearCal = () => {
        setCourseEvents({});
        setMBZEvents({});
    }

    const notifyMBZSubmited = async (file: File) => {
        const unorderedData = await extractData(file);
        const mbzArchive = parseActivities(unorderedData);
        setMVZData(mbzArchive);
        const newMBZEvents = makeEvents(mbzArchive);
        addUniqueEvents(newMBZEvents, MBZEvents);
        setMBZEvents({...MBZEvents});
    }

    const notifyMBZDownload = (oldURL: string) => {
        URL.revokeObjectURL(oldURL);
        const file = new Blob([zipData(mbzData)], { type: 'application/octet-stream' });        
        return URL.createObjectURL(file);
    }

    return (
        <EventControllerContext.Provider value={{notifyCourseFormSubmit, notifyClearCal, notifyMBZSubmited, notifyMBZDownload}}>
            {children}
        </EventControllerContext.Provider>
    );
}