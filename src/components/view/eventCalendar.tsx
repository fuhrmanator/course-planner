import React, {useCallback, useContext, useEffect, useState} from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModelContext } from '@/components/model/eventModel';
import {findEarliestEvent, setEventsColour} from '@/components/controller/util/eventsOperations';
import {CalEvent, CalEventType, CalEventTypeColour} from "@/components/model/interfaces/events/calEvent";
import {EventControllerContext} from "@/components/controller/eventController";
import CalLegend from "@/components/view/calLegend";


const EventCalendar: React.FC = () => {
    const { notifyEventSelected } = useContext(EventControllerContext)
    const {selectedEvent, events, eventTypeColour} = useContext(EventModelContext);
    const [selectedDate, setSelectedDate] = useState<Date>(events.length > 0 ? findEarliestEvent(events).start : new Date());

    useEffect(() => {
        if (typeof selectedEvent !== "undefined") {
            setSelectedDate(selectedEvent.start);
        }
    }, [selectedEvent]);

    const onNavigate = (newDate: Date) => {
        setSelectedDate(newDate);
    }

    const onSelectEvent = (event: CalEvent, e: any) => {
        notifyEventSelected(event);
    };

    const getEventColour = (event:CalEvent):string => {
        const foundTypeColour = eventTypeColour.find((typeColour) => (typeColour.type === event.type));
        let eventColour;
        if (typeof foundTypeColour === "undefined") {
            eventColour = "blue";
        } else {
            eventColour = foundTypeColour.colour;
        }
        return eventColour;
    }

    const addColourToEventsCallback = useCallback(
        (event:CalEvent, start:Date, end:Date, isSelected:boolean) => {
            return {
                event,
                start,
                end,
                isSelected,
                style: { backgroundColor: getEventColour(event) }}},
        [eventTypeColour]
    )

    const localizer = momentLocalizer(moment);

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                date={selectedDate}
                onNavigate={onNavigate}
                onSelectEvent={onSelectEvent}
                eventPropGetter={addColourToEventsCallback}
            />
            <CalLegend />
        </div>
    );
};

export default EventCalendar;
