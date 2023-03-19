import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModelContext } from '@/components/model/eventModel';
import { findEarliestEvent } from '@/components/controller/util/eventsOperations';
import {CalEvent} from "@/components/model/interfaces/events/calEvent";
import {EventControllerContext} from "@/components/controller/eventController";


const EventCalendar: React.FC = () => {
    const { notifyEventSelected } = useContext(EventControllerContext)
    const {selectedEvent, events} = useContext(EventModelContext);
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
            />
        </div>
    );
};

export default EventCalendar;
