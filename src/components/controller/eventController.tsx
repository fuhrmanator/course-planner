import React, {useState, useContext, createContext, MouseEventHandler} from 'react';
import {CalEvent} from '@/components/model/interfaces/events/calEvent'
import fetchCourseICAL from './util/fetchCourseICAL'
import {addUniqueEvents, mapICALtoEvent} from './util/eventOperations';
import { EventModelContext } from '@/components/model/eventModel';
import { extractData, parseActivities, zipData } from './util/mbzInterpreter';
import { ArchiveFile } from '@/components/model/interfaces/archiveFile';
import { updateEventDates } from './util/updateEventDates';

type EventControllerContextProps = {
    notifyCourseFormSubmit : (code: string, group: number, year: number, semester:number) => void;
    notifyClearCal : () => void;
    notifyUpdateEvent: (eventId: CalEvent, newStart: Date, newEnd: Date ) => void;
    notifyMBZSubmited : (file: File) => void;
    notifyMBZDownload : (oldURL: string) => string;
   }

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
    children: React.ReactNode;
}

export const EventController: React.FC<CalControllerProps> = ({children}) => {
    const {courseEvents, setCourseEvents, MBZEvents, setMBZEvents} = useContext(EventModelContext);
    const [mbzData, setMVZData] = useState<{[key:string]:ArchiveFile}>({});
   
    const notifyCourseFormSubmit = async (code: string, group: number, year: number, semester:number) => {
        const textData = await fetchCourseICAL(code, group, year, semester);
        const newEvents = mapICALtoEvent(textData);
        addUniqueEvents(newEvents, courseEvents);
        setCourseEvents({...courseEvents});
    }

    const notifyClearCal = () => {
        setCourseEvents({});
        setMBZEvents({});
    }

    const notifyMBZSubmited = async (file: File) => {
        const fileData = await extractData(file);
        setMVZData(fileData);
        const newMBZEvents = await parseActivities(fileData);
        addUniqueEvents(newMBZEvents, MBZEvents);
        setMBZEvents({...MBZEvents});
    }

    const notifyMBZDownload = (oldURL: string) => {
        URL.revokeObjectURL(oldURL);
        const file = new Blob([zipData(mbzData)], { type: 'application/octet-stream' });        
        return URL.createObjectURL(file);
    }

    /*const notifyUpdateEvent = (eventId: CalEvent, newStart: Date, newEnd: Date) => {
        // const updatedEvents = updateEventDates(newStart, newEnd, new {... MBZEvents}, eventId)
      
         //MBZEvents[eventId.uid].start = new Date(MBZEvents[eventId.uid].start.getFullYear(),MBZEvents[eventId.uid].start.getMonth(),MBZEvents[eventId.uid].start.getDay());
         console.log("date complete start :   "+new Date(MBZEvents[eventId.uid].start.getFullYear(),MBZEvents[eventId.uid].start.getMonth(),MBZEvents[eventId.uid].start.getDay()))
      
         //MBZEvents[eventId.uid].end = new Date(MBZEvents[eventId.uid].end.getFullYear(),MBZEvents[eventId.uid].end.getMonth(),MBZEvents[eventId.uid].end.getDay()+2);
         console.log("date complete end  :   "+(MBZEvents[eventId.uid].end.setDate(MBZEvents[eventId.uid].end.getDate() + 2)))
         setMBZEvents({...MBZEvents});  
      };  */
      const notifyUpdateEvent = (eventId: CalEvent, newStart: Date, newEnd: Date ) => {
        const updatedEvent = { ...MBZEvents[eventId.uid] };

        updatedEvent.start=newStart;
        updatedEvent.end=newEnd;
        setMBZEvents((prevEvents) => ({
          ...prevEvents,
          [eventId.uid]: updatedEvent,
        }));
      };
      

    return (
        <EventControllerContext.Provider value={{notifyCourseFormSubmit, notifyClearCal, notifyUpdateEvent, notifyMBZSubmited, notifyMBZDownload}}>
            {children}
        </EventControllerContext.Provider>
    );
}

