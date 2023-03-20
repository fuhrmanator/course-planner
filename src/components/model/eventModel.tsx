import {CourseEvent, EventTypeColour} from './interfaces/events/courseEvent'
import React, {useState, createContext, useEffect, useRef} from 'react'
import {callbackIfValuePresent, getValue, setValue} from './localStore';
import { ActivityEvent } from './interfaces/events/activityEvent';
import {defaultEventColours} from "@/components/model/ressource/eventRessource";
import {findEarliestEvent} from "@/components/controller/util/eventsOperations";

type EventModelContextProps = {
    events: CourseEvent[],
    oldCourseEvents: CourseEvent[],
    setOldCourseEvents: React.Dispatch<React.SetStateAction<CourseEvent[]>>,
    newCourseEvents: CourseEvent[],
    setNewCourseEvents: React.Dispatch<React.SetStateAction<CourseEvent[]>>,
    activityEvents: ActivityEvent[],
    setActivityEvents: React.Dispatch<React.SetStateAction<ActivityEvent[]>>;
    selectedEvent: CourseEvent | undefined,
    setSelectedEvent: React.Dispatch<React.SetStateAction<CourseEvent | undefined>>,
    eventTypeColour: EventTypeColour[],
    setEventTypeColour: React.Dispatch<React.SetStateAction<EventTypeColour[]>>;
}

export const EventModelContext = createContext<EventModelContextProps>({} as EventModelContextProps);

type CalModelProps = {
    children: React.ReactNode;
}

const LOCAL_STORE_OLD_COURSE_KEY = 'old_course_events';
const LOCAL_STORE_NEW_COURSE_KEY = 'new_course_events';
const LOCAL_STORE_ACTIVITY_KEY = 'activity_events';
const LOCAL_STORE_COLOUR_KEY = 'type_colours';

export const EventModel: React.FC<CalModelProps> = ({children}) => {

    const [events, setEvents] = useState<CourseEvent[]>([]);

    const [oldCourseEvents, setOldCourseEvents] = useState<CourseEvent[]>([]);
    const [newCourseEvents, setNewCourseEvents] = useState<CourseEvent[]>([]);
    const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);

    const [selectedEvent, setSelectedEvent] = useState<CourseEvent|undefined>(undefined);

    const areEventsLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
        if (areEventsLoadedFromStore.current) { // updates local storage once true data changes
            setValue(LOCAL_STORE_OLD_COURSE_KEY, oldCourseEvents);
            setValue(LOCAL_STORE_NEW_COURSE_KEY, newCourseEvents);
            setValue(LOCAL_STORE_ACTIVITY_KEY, activityEvents);
        } else { // replace dummy array with true values when it's created
            areEventsLoadedFromStore.current = true;
            callbackIfValuePresent(LOCAL_STORE_OLD_COURSE_KEY, setOldCourseEvents);
            callbackIfValuePresent(LOCAL_STORE_NEW_COURSE_KEY, setNewCourseEvents);
            callbackIfValuePresent(LOCAL_STORE_ACTIVITY_KEY, setActivityEvents);
        }
        setEvents([...oldCourseEvents,...newCourseEvents, ...activityEvents]);
    }, [oldCourseEvents, newCourseEvents, activityEvents]);

    const [eventTypeColour, setEventTypeColour] = useState<EventTypeColour[]>(defaultEventColours);

    const areColoursLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
            if (areColoursLoadedFromStore.current) {
                setValue(LOCAL_STORE_COLOUR_KEY, eventTypeColour);
            } else {
                areColoursLoadedFromStore.current = true;
                callbackIfValuePresent(LOCAL_STORE_COLOUR_KEY, setEventTypeColour);
            }
    }, [eventTypeColour]);

    return (
        <EventModelContext.Provider value = {{events, oldCourseEvents, setOldCourseEvents, newCourseEvents, setNewCourseEvents, activityEvents, setActivityEvents, selectedEvent, setSelectedEvent, eventTypeColour, setEventTypeColour}}>
            {children}
        </ EventModelContext.Provider>
    )
}