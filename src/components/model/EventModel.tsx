import {
    ActivityEvent,
    CourseEvent,
    EventTypeColour,
    SuggestionConfigDict,
    TypeColourDict
} from './interfaces/courseEvent'
import React, {useState, createContext, useEffect, useRef} from 'react'
import {callbackIfValuePresent, getValue, setValue} from './localStore';

import {
    defaultEventColours,
    defaultSuggestionTypeMapping,

} from "@/components/model/ressource/eventRessource";
import {
    getUnsavedStates,
    parseStoredEvent,
    parseStoredEvents
} from "@/components/controller/util/eventsOperations";

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
    eventTypeColour: TypeColourDict,
    setEventTypeColour: React.Dispatch<React.SetStateAction<TypeColourDict>>;
    suggestionConfig: SuggestionConfigDict,
    setSuggestionConfig: React.Dispatch<React.SetStateAction<SuggestionConfigDict>>;
}

export const EventModelContext = createContext<EventModelContextProps>({} as EventModelContextProps);

type CalModelProps = {
    children: React.ReactNode;
}

const LOCAL_STORE_OLD_COURSE_KEY = 'old_course_events';
const LOCAL_STORE_NEW_COURSE_KEY = 'new_course_events';
const LOCAL_STORE_ACTIVITY_KEY = 'activity_events';
const LOCAL_STORE_COLOUR_KEY = 'type_colours';
const LOCAL_STORE_SUGGESTION_KEY = 'suggestion_config';
const LOCAL_STORE_SELECTED_KEY = 'selected_event';

export const EventModel: React.FC<CalModelProps> = ({children}) => {

    const [events, setEvents] = useState<CourseEvent[]>([]);

    const [oldCourseEvents, setOldCourseEvents] = useState<CourseEvent[]>([]);
    const [newCourseEvents, setNewCourseEvents] = useState<CourseEvent[]>([]);
    const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);

    const [selectedEvent, setSelectedEvent] = useState<CourseEvent|undefined>(undefined);

    const [suggestionConfig, setSuggestionConfig] = useState<SuggestionConfigDict>(defaultSuggestionTypeMapping);

    const areEventsLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
        if (areEventsLoadedFromStore.current) { // updates local storage once true data changes
            setValue(LOCAL_STORE_OLD_COURSE_KEY, oldCourseEvents);
            setValue(LOCAL_STORE_NEW_COURSE_KEY, newCourseEvents);
            setValue(LOCAL_STORE_ACTIVITY_KEY, activityEvents);
            setValue(LOCAL_STORE_SELECTED_KEY, selectedEvent);
        } else { // replace dummy array with true values when it's created
            areEventsLoadedFromStore.current = true;
            callbackIfValuePresent(LOCAL_STORE_OLD_COURSE_KEY, parseStoredEvents, setOldCourseEvents);
            callbackIfValuePresent(LOCAL_STORE_NEW_COURSE_KEY, parseStoredEvents, setNewCourseEvents);
            callbackIfValuePresent(LOCAL_STORE_ACTIVITY_KEY, parseStoredEvents, setActivityEvents);
            callbackIfValuePresent(LOCAL_STORE_SELECTED_KEY, parseStoredEvent, setSelectedEvent);
        }
        setEvents([...oldCourseEvents,...newCourseEvents, ...activityEvents, ...getUnsavedStates(activityEvents)]);
    }, [oldCourseEvents, newCourseEvents, activityEvents]);

    const [eventTypeColour, setEventTypeColour] = useState<TypeColourDict>(defaultEventColours);

    const areColoursLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
            if (areColoursLoadedFromStore.current) {
                setValue(LOCAL_STORE_COLOUR_KEY, eventTypeColour);
            } else {
                areColoursLoadedFromStore.current = true;
                callbackIfValuePresent(LOCAL_STORE_COLOUR_KEY, JSON.parse, setEventTypeColour);
            }
    }, [eventTypeColour]);

    const isSuggestionConfigLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
        if (isSuggestionConfigLoadedFromStore.current) {
            setValue(LOCAL_STORE_SUGGESTION_KEY, suggestionConfig);
        } else {
            isSuggestionConfigLoadedFromStore.current = true;
            callbackIfValuePresent(LOCAL_STORE_SUGGESTION_KEY, JSON.parse, setSuggestionConfig);
        }
    }, [suggestionConfig]);

    return (
        <EventModelContext.Provider value = {{events,
            oldCourseEvents,
            setOldCourseEvents,
            newCourseEvents,
            setNewCourseEvents,
            activityEvents,
            setActivityEvents,
            selectedEvent,
            setSelectedEvent,
            eventTypeColour,
            setEventTypeColour,
            suggestionConfig,
            setSuggestionConfig}}>
            {children}
        </ EventModelContext.Provider>
    )
}