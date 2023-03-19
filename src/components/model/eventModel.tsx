import {CalEvent, CalEventTypeColour} from './interfaces/events/calEvent'
import React, {useState, createContext, useEffect, useRef} from 'react'
import {getValue, setValue} from './localStore';
import { MBZEvent } from './interfaces/events/mbzEvent';
import {defaultEventColours} from "@/components/model/ressource/eventRessource";
import {findEarliestEvent} from "@/components/controller/util/eventsOperations";

type EventModelContextProps = {
    events: CalEvent[],
    courseEvents: EventDict,
    setCourseEvents: React.Dispatch<React.SetStateAction<EventDict>>,
    MBZEvents: MBZEventDict,
    setMBZEvents: React.Dispatch<React.SetStateAction<MBZEventDict>>;
    selectedEvent: CalEvent | undefined,
    setSelectedEvent: React.Dispatch<React.SetStateAction<CalEvent | undefined>>,
    eventTypeColour: CalEventTypeColour[],
    setEventTypeColour: React.Dispatch<React.SetStateAction<CalEventTypeColour[]>>;
}


export const EventModelContext = createContext<EventModelContextProps>({} as EventModelContextProps);


type CalModelProps = {
    children: React.ReactNode;
}

const LOCAL_STORE_COURSE_KEY = 'course_events';
const LOCAL_STORE_MBZ_KEY = 'mbz_events';
const LOCAL_STORE_COLOUR_KEY = 'type_colours';

export type EventDict = {[key:string]: CalEvent};
export type MBZEventDict = {[key: string]: MBZEvent;}



export const EventModel: React.FC<CalModelProps> = ({children}) => {

    const [events, setEvents] = useState<CalEvent[]>([]);

    const [courseEvents, setCourseEvents] = useState<EventDict>({});
    const [MBZEvents, setMBZEvents] = useState<MBZEventDict>({});

    const [selectedEvent, setSelectedEvent] = useState<CalEvent|undefined>(undefined);

    const areEventsLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
        console.log("events")
        if (areEventsLoadedFromStore.current) { // updates local storage once true data changes
            setValue(LOCAL_STORE_COURSE_KEY, courseEvents);
            setValue(LOCAL_STORE_MBZ_KEY, MBZEvents);
        } else { // replace dummy array with true values when it's created
            areEventsLoadedFromStore.current = true;
            setCourseEvents(getValue(LOCAL_STORE_COURSE_KEY, "{}"));
            setMBZEvents(getValue(LOCAL_STORE_MBZ_KEY, "{}"));
        }
        setEvents([...Object.values(courseEvents),...Object.values(MBZEvents)]);
    }, [courseEvents, MBZEvents]);

    const [eventTypeColour, setEventTypeColour] = useState<CalEventTypeColour[]>([]);

    const areColoursLoadedFromStore = useRef<boolean>(false);
    useEffect(()=>{
        console.log("colors")
            if (areColoursLoadedFromStore.current) {
                setValue(LOCAL_STORE_COLOUR_KEY, eventTypeColour);
            } else {
                areColoursLoadedFromStore.current = true;
                const storedEventColours = getValue(LOCAL_STORE_COLOUR_KEY, "[]")
                if (storedEventColours.length === 0) {
                    setEventTypeColour(defaultEventColours);
                    setValue(LOCAL_STORE_COLOUR_KEY, defaultEventColours);
                } else {
                    setEventTypeColour(storedEventColours);
                }
            }
    }, [eventTypeColour]);

    return (
        <EventModelContext.Provider value = {{events, courseEvents, setCourseEvents, MBZEvents, setMBZEvents, selectedEvent, setSelectedEvent, eventTypeColour, setEventTypeColour}}>
            {children}
        </ EventModelContext.Provider>
    )
}