import React, {createContext, useContext} from 'react';
import fetchCourseICAL from './util/fetchOperations'
import {parseICALEvents} from './util/icalInterpreter';
import {EventModelContext} from '@/components/model/EventModel';
import {applyChangesToArchive, extractData, makeEvents, parseActivities, zipData} from './util/mbzInterpreter';
import {
    addSuggestion,
    cancelAllUnsavedState,
    findEarliestEvent,
    findEventIndexWithType,
    getDateOrThrow,
    getOrAddUnsavedState,
    getUnsavedStates,
    removeUnsavedState,
    saveAll,
    saveState,
    setEndIfHomework
} from './util/eventsOperations';
import MBZArchive from '../model/interfaces/archive/MBZArchive';
import {
    ActivityEvent,
    ActivityType,
    CourseEvent,
    CourseType,
    CoursEventDateGetter as CourseEventDateGetter,
    EventType
} from "@/components/model/interfaces/courseEvent";
import {parseDSL, updateDSL} from "@/components/controller/util/dsl/dslOperations";
import {DSLDateRef, DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {DSL_TIME_UNIT_TO_MS} from '../model/ressource/dslRessource';


type EventControllerContextProps = {
    notifyCourseFormSubmit: (code: string, group: number, year: number, semester: number, isOldCourse: boolean) => void;
    notifyClearCal: () => void;
    notifyEventSelected: (event: CourseEvent | undefined) => void;
    notifyMBZSubmitted: (file: File) => void;
    notifyMBZDownload: (oldURL: string) => string;
    notifyEventColourUpdate: (type: EventType, newColour: string) => void;
    notifySuggestionConfigUpdate: (type: ActivityType, mapping: CourseType[]) => void;
    notifySuggestion: () => void;
    notifySaveChanges: (event: CourseEvent | undefined) => void;
    notifyCancelChanges: (event: CourseEvent | undefined) => void;

    notifySubmitDSL: (dsl: string) => void;
    setEventRelativeDate: (activity: ActivityEvent,
                           relativeTo: CourseEvent,
                           activityDateGetter: CourseEventDateGetter,
                           courseDateGetter: CourseEventDateGetter,
                           courseDateRef: DSLDateRef,
                           offsetValue: number,
                           offsetUnit: DSLTimeUnit | undefined,
                           atMinutes: number | undefined,
                           atHours: number | undefined,
                           dslIndex: number) => void;

}

export const EventControllerContext = createContext<EventControllerContextProps>({} as EventControllerContextProps);

type CalControllerProps = {
    children: React.ReactNode;
}
/**
 * Application's controller. Has the responsibility to expose functions used by the view to modify the data. It exposes
 * these functions using react contexts (EventControllerContext).
 */
export const EventController: React.FC<CalControllerProps> = ({children}) => {
    const {
        oldCourseEvents,
        setOldCourseEvents,
        newCourseEvents,
        setNewCourseEvents,
        activityEvents,
        setActivityEvents,
        setSelectedEvent,
        eventTypeColour,
        setEventTypeColour,
        suggestionConfig,
        setSuggestionConfig,
        mbzData,
        setMVZData
    } = useContext(EventModelContext);

    const setSelectedToEarliest = (events: CourseEvent[]): void => {
        if (events.length > 0) {
            setSelectedEvent(findEarliestEvent(events));
        }
    }

    const setEventsIfEmpty = (events: CourseEvent[], addTo: CourseEvent[], callback: (events: any) => void): void => {
        if (addTo.length === 0) {
            setEvents(events, callback);
        }
    }

    const setEvents = (events: CourseEvent[], setCallback: (events: CourseEvent[]) => void) => {
        setCallback(events);
        setSelectedToEarliest(events);
    }

    const notifyCourseFormSubmit = async (code: string, group: number, year: number, semester: number, isOldCourse: boolean) => {
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
        setMVZData(new MBZArchive());
    }

    const notifyMBZSubmitted = async (file: File) => {
        const unorderedData = await extractData(file);
        const mbzArchive = parseActivities(unorderedData);
        setMVZData(mbzArchive);
        const newMBZEvents: ActivityEvent[] = makeEvents(mbzArchive);
        setEventsIfEmpty(newMBZEvents, activityEvents, setActivityEvents);
    }

    const notifyMBZDownload = (oldURL: string) => {
        URL.revokeObjectURL(oldURL);
        applyChangesToArchive(mbzData, Object.values(activityEvents));
        const file = new Blob([zipData(mbzData)], {type: 'application/octet-stream'});
        return URL.createObjectURL(file);
    }

    const notifyEventSelected = (event: CourseEvent | undefined) => {
        console.log(event)
        setSelectedEvent(event);
    }

    const notifyEventColourUpdate = (type: EventType, newColour: string) => {
        eventTypeColour[type] = newColour;
        setEventTypeColour({...eventTypeColour});
    };

    const notifySuggestionConfigUpdate = (type: ActivityType, mapping: CourseType[]): void => {
        suggestionConfig[type] = mapping;
        setSuggestionConfig({...suggestionConfig});
    }

    const notifySuggestion = () => {
        addSuggestion(activityEvents, oldCourseEvents, newCourseEvents, suggestionConfig);
        setSelectedToEarliest(getUnsavedStates(activityEvents));
        setActivityEvents([...activityEvents]);
    };
    const notifyCancelChanges = (event: CourseEvent | undefined = undefined) => {
        if (typeof event === "undefined") {
            cancelAllUnsavedState(activityEvents);
        } else {
            removeUnsavedState(event)
            notifyEventSelected({...event})
        }
        setActivityEvents([...activityEvents]);
    }
    const notifySaveChanges = (event: CourseEvent | undefined = undefined) => {
        if (typeof event === "undefined") {
            saveAll(activityEvents);
        } else {
            saveState(event)
            notifyEventSelected({...event})
        }
        setActivityEvents([...activityEvents]);
    }

    const notifySubmitDSL = (dsl: string) => {
        parseDSL(dsl, activityEvents, newCourseEvents);
        setActivityEvents([...activityEvents]);
        setSelectedToEarliest(getUnsavedStates(activityEvents));
    }

    const setEventRelativeDate = (
        activity: ActivityEvent,
        relativeTo: CourseEvent,
        activityDateGetter: CourseEventDateGetter,
        courseDateGetter: CourseEventDateGetter,
        courseDateRef: DSLDateRef,
        offsetValue: number,
        offsetUnit: DSLTimeUnit | undefined,
        atMinutes: number | undefined,
        atHours: number | undefined,
        dslIndex: number
    ) => {
        const offsetMS = typeof offsetUnit === "undefined" ? 0 : offsetValue * DSL_TIME_UNIT_TO_MS[offsetUnit];
        const eventState = getOrAddUnsavedState(activity);
        const activityDate = getDateOrThrow(eventState, activityDateGetter);
        const courseDate = getDateOrThrow(relativeTo, courseDateGetter);
        activityDate.setTime(courseDate.getTime() + offsetMS);
        if (typeof atMinutes !== "undefined") {
            activityDate.setMinutes(atMinutes)
        }
        if (typeof atHours !== "undefined") {
            activityDate.setHours(atHours)
        }
        setEndIfHomework(eventState)
        updateDSL(eventState.dsl,
                dslIndex,
                activity.type,
                findEventIndexWithType(activity, activityEvents),
                relativeTo.type,
                findEventIndexWithType(relativeTo, newCourseEvents),
                courseDateRef, offsetValue,
                offsetUnit,
                atMinutes,
                atHours)
        setActivityEvents([...activityEvents]);
        notifyEventSelected({...eventState})

    };

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
            notifySaveChanges,
            notifyCancelChanges,
            notifySubmitDSL,
            setEventRelativeDate
        }}>
            {children}
        </EventControllerContext.Provider>
    );
}