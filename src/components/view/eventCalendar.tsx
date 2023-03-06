import React, { createContext, useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModelContext } from '@/components/model/eventModel';
import { findEarliestEventDate } from '../controller/util/eventOperations';

import UpdateEventButton from "./updatedEventButton";

interface CalEvent {
  start: Date;
  end: Date;
  title: string;
  type: number;
  uid: string;
  //...
}

interface EventCalendarContextProps {
  calendarEvents: CalEvent[];
  setCalendarEvents: (events: CalEvent[]) => void;
}

export const EventSelectionContext = createContext<CalEvent | null>(null);

const EventList: React.FC = () => {
  const { events } = useContext(EventModelContext);
  const [calendarEvents, setCalendarEvents] = useState<CalEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(findEarliestEventDate(events));
  const [selectedEvent, setSelectedEvent] = useState<CalEvent | null>(null);

  useEffect(() => {
    // Convert events to the required format for react-big-calendar
    const formattedEvents: CalEvent[] = events.map((event) => ({
      start: new Date(event.start),
      end: new Date(event.end),
      title: event.title,
      type: event.type,
      uid: event.uid,
      //...
    }));
    setCalendarEvents(formattedEvents);
    setSelectedDate(findEarliestEventDate(events));
  }, [events]);

  const onNavigate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const onSelectEvent = (event: CalEvent, e: any) => {
    setSelectedEvent(event);
  };

  const localizer = momentLocalizer(moment);

  return (
    <EventSelectionContext.Provider value={selectedEvent}>
      <div>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          date={selectedDate}
          onNavigate={onNavigate}
          onSelectEvent={onSelectEvent}
          selectable
        />
        <UpdateEventButton />
      </div>
    </EventSelectionContext.Provider>
  );
};

export default EventList;
