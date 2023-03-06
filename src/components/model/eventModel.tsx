import {CalEvent} from './interfaces/events/calEvent'
import React, {useState, createContext, useEffect, useRef} from 'react'
import {getValue, setValue} from './localStore';
import { MBZEvent } from './interfaces/events/mbzEvent';
//import { updateEventDates } from '../controller/util/updateEventDates';

type EventModelContextProps = {
    events: CalEvent[],
    setEvents: React.Dispatch<React.SetStateAction<CalEvent[]>>,
    courseEvents: EventDict,
    setCourseEvents: React.Dispatch<React.SetStateAction<EventDict>>,
    MBZEvents: MBZEventDict,
    setMBZEvents: React.Dispatch<React.SetStateAction<MBZEventDict>>;
  }


export const EventModelContext = createContext<EventModelContextProps>({} as EventModelContextProps);


type CalModelProps = {
    children: React.ReactNode;
}

const LOCAL_STORE_COURSE_KEY = 'course_events';
const LOCAL_STORE_MBZ_KEY = 'mbz_events';

export type EventDict = {[key:string]: CalEvent};
export type MBZEventDict = {[key: string]: MBZEvent;}



export const EventModel: React.FC<CalModelProps> = ({children}) => {
    // creates a dummy objects because of SSR and client-server HTML dif exception
    const [events, setEvents] = useState<CalEvent[]>([]); 
   
    const [courseEvents, setCourseEvents] = useState<EventDict>({}); 
    const [MBZEvents, setMBZEvents] = useState<MBZEventDict>({}); 

    const isFirstRender = useRef<boolean>(true);

    useEffect(()=>{
        if (isFirstRender.current) { // replace dummy array with true values when it's created
            isFirstRender.current=false;
            setCourseEvents(getValue(LOCAL_STORE_COURSE_KEY, "{}"));
            setMBZEvents(getValue(LOCAL_STORE_MBZ_KEY, "{}"));
        } else { // updates local storage once true data changes
            setValue(LOCAL_STORE_COURSE_KEY, courseEvents);
            setValue(LOCAL_STORE_MBZ_KEY, MBZEvents);
        }
        setEvents([...Object.values(courseEvents),...Object.values(MBZEvents)]);
    }, [courseEvents, MBZEvents]);

    return (
        <EventModelContext.Provider value = {{events, setEvents, courseEvents, setCourseEvents, MBZEvents, setMBZEvents}}>
            {children}
        </ EventModelContext.Provider>
    )
}