import React, {useState, useContext, createContext} from 'react';
import fetchCourseICAL from './util/fetchOperations'
import {parseICALEvents} from './util/icalInterpreter';
import { EventModelContext } from '@/components/model/EventModel';
import { applyChangesToArchive, extractData, makeEvents, parseActivities, zipData } from './util/mbz/mbzInterpreter';
import {
    addSuggestion, cancelAllUnsavedState,
    findEarliestEvent,
    getUnsavedStates,
    saveAll
} from './util/eventsOperations';
import MBZArchive from '../model/interfaces/archive/MBZArchive';
import {
    ActivityEvent,
    ActivityType,
    CourseEvent,
    CourseType,
    EventType,
    TypeColourDict
} from "@/components/model/interfaces/courseEvent";
import suggestionButton from "@/components/view/buttons/SuggestionButton";
import cancelChangesButton from "@/components/view/buttons/CancelChangesButton";



type EventControllerContextProps = {
    notifyCourseFormSubmit : (code: string, group: number, year: number, semester:number, isOldCourse:boolean) => void;
    notifyClearCal : () => void;
    notifyEventSelected: (event:CourseEvent) => void;
    notifyMBZSubmitted : (file: File) => void;
    notifyMBZDownload : (oldURL: string) => string;
    notifyEventColourUpdate: (type: EventType, newColour: string) => void;
    notifySuggestionConfigUpdate: (type: ActivityType, mapping: CourseType) => void;
    notifySuggestion: ()=>void;
    notifySaveAllChanges: ()=>void;
    notifyCancelChanges: ()=>void;
}

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
    children: React.ReactNode;
}

export const EventController: React.FC<CalControllerProps> = ({children}) => {
    const {oldCourseEvents, setOldCourseEvents, newCourseEvents, setNewCourseEvents, activityEvents, setActivityEvents, setSelectedEvent, eventTypeColour, setEventTypeColour, suggestionConfig, setSuggestionConfig} = useContext(EventModelContext);
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

    const notifyEventColourUpdate = (type: EventType, newColour: string) => {
        eventTypeColour[type] = newColour;
        setEventTypeColour({...eventTypeColour});
    };

    const notifySuggestionConfigUpdate = (type: ActivityType, mapping: CourseType):void => {
        suggestionConfig[type] = mapping;
        setSuggestionConfig({...suggestionConfig});
    }

    const notifySuggestion = () => {
        addSuggestion(activityEvents,oldCourseEvents,newCourseEvents,suggestionConfig);
        setSelectedToEarliest(getUnsavedStates(activityEvents));
        setActivityEvents([...activityEvents]);
    };
    const notifyCancelChanges = () => {
        cancelAllUnsavedState(activityEvents);
        setActivityEvents([... activityEvents]);
    }
    const notifySaveAllChanges = () => {
        saveAll(activityEvents);
        setActivityEvents([...activityEvents]);
    }

    return (
        <EventControllerContext.Provider value={{
            notifyCourseFormSubmit,
            notifyClearCal,
            notifyEventSelected,
            notifyMBZSubmitted,
            notifyMBZDownload,
            notifyEventColourUpdate,
            notifySuggestionConfigUpdate,
            notifySuggestion,
            notifySaveAllChanges,
            notifyCancelChanges}}>
            {children}
        </EventControllerContext.Provider>
    );
}