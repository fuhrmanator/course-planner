import React, { useState, useContext, createContext } from 'react';
import fetchCourseICAL from './util/fetchOperations';
import { parseICALEvents } from './util/icalInterpreter';
import { EventModelContext, MBZEventDict } from '@/components/model/eventModel';
import { extractData, parseActivities, zipData } from './util/mbzInterpreter';
import { ArchiveFile } from '@/components/model/interfaces/archiveFile';
import { addUniqueEvents, removeEvent } from './util/eventsOperations';

type EventControllerContextProps = {
    notifyCourseFormSubmit: (code: string, group: number, year: number, semester:number) => void;
    notifyClearCal: () => void;
    notifyMBZSubmited: (file: File) => void;
    notifyMBZDownload: (oldURL: string) => string;
    notifyDeleteEvent: (uid: string) => void;
  }
  

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
  children: React.ReactNode;
};

export const EventController: React.FC<CalControllerProps> = ({ children }) => {
  const { courseEvents, setCourseEvents, MBZEvents, setMBZEvents } = useContext(EventModelContext);
  const [mbzData, setMBZData] = useState<{ [key: string]: ArchiveFile }>({});

  const notifyCourseFormSubmit = async (code: string, group: number, year: number, semester:number) => {
    const textData = await fetchCourseICAL(code, group, year, semester);
    const newEvents = parseICALEvents(textData);
    const updatedCourseEvents = newEvents.reduce((acc, curr) => {
        return {...acc, [curr.uid]: curr};
    }, {});
    setCourseEvents((prevCourseEvents) => ({ ...prevCourseEvents, ...updatedCourseEvents }));
};


  const notifyClearCal = () => {
    setCourseEvents({});
    setMBZEvents({});
  };

  const notifyMBZSubmited = async (file: File) => {
    const fileData = await extractData(file);
    setMBZData(fileData);
    const newMBZEvents = await parseActivities(fileData);
    const updatedMBZEvents = newMBZEvents.reduce((acc, curr) => {
        return {...acc, [curr.uid]: curr};
    }, {});
    setMBZEvents((prevMBZEvents) => ({ ...prevMBZEvents, ...updatedMBZEvents }));
};


  const notifyMBZDownload = (oldURL: string) => {
    URL.revokeObjectURL(oldURL);
    const file = new Blob([zipData(mbzData)], { type: 'application/octet-stream' });
    return URL.createObjectURL(file);
  };

  const notifyDeleteEvent = (uid: string) => {
    const updatedCourseEvents = removeEvent(uid, courseEvents);
    if (updatedCourseEvents) {
      setCourseEvents(updatedCourseEvents);
    }
  
    const updatedMBZEvents: MBZEventDict = {};
    for (const [key, value] of Object.entries(MBZEvents)) {
      if (value.uid !== uid) {
        updatedMBZEvents[key] = value;
      }
    }
    setMBZEvents(updatedMBZEvents);
  };
  

  return (
    <EventControllerContext.Provider
      value={{ notifyCourseFormSubmit, notifyClearCal, notifyMBZSubmited, notifyMBZDownload, notifyDeleteEvent }}
    >
      {children}
    </EventControllerContext.Provider>
  );
};
