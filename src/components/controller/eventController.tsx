import React, { useState, useContext, createContext } from 'react';
import fetchCourseICAL from './util/fetchOperations';
import { parseICALEvents } from './util/icalInterpreter';
import { EventModelContext } from '@/components/model/eventModel';
import { extractData, parseActivities, zipData } from './util/mbzInterpreter';
import { ArchiveFile } from '@/components/model/interfaces/archiveFile';
import { addUniqueEvents, removeEvent } from './util/eventsOperations';
import { EventDict, MBZEventDict } from '@/components/model/eventModel';

export interface EventControllerContextProps {
  notifyCourseFormSubmit: (code: string, group: number, year: number, semester: number) => Promise<void>;
  notifyClearCal: () => void;
  notifyMBZSubmited: (file: File) => Promise<void>;
  notifyMBZDownload: (oldURL: string) => string;
  notifyDeleteEvent: (uid: string) => void;
  deleteEvent: (event: any) => void; 
}

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
  children: React.ReactNode;
}

export const EventController: React.FC<CalControllerProps> = ({children}) => {
  const { courseEvents, setCourseEvents, MBZEvents, setMBZEvents } = useContext(EventModelContext);
  const [mbzData, setMVZData] = useState<{[key:string]:ArchiveFile}>({});

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

  const notifyDeleteEvent = (uid: string) => {
    const updatedCourseEvents: EventDict = {...courseEvents};
    const updatedMBZEvents: MBZEventDict = {...MBZEvents};
    
    if (updatedCourseEvents[uid]) {
        delete updatedCourseEvents[uid];
        setCourseEvents(updatedCourseEvents);
    }
    
    if (updatedMBZEvents[uid]) {
        delete updatedMBZEvents[uid];
        setMBZEvents(updatedMBZEvents);
    }
  }

  const deleteEvent = (event: any) => {
    const updatedEvents = removeEvent(event, courseEvents, MBZEvents);
    setCourseEvents(updatedEvents.courseEvents);
    setMBZEvents(updatedEvents.MBZEvents);
  };
  

  return (
    <EventControllerContext.Provider value={{notifyCourseFormSubmit, notifyClearCal, notifyMBZSubmited, notifyMBZDownload, notifyDeleteEvent, deleteEvent}}>
      {children}
    </EventControllerContext.Provider>
  );
}
