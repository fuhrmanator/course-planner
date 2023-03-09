import React, { createContext, useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { EventModelContext } from '@/components/model/eventModel';
import { findEarliestEventDate } from '../controller/util/eventOperations';

import { EventControllerContext } from '../controller/eventController';
import { CalEvent } from '../model/interfaces/events/calEvent';

const EventCalendar: React.FC = () => {
  const { notifyEventSelected } = useContext(EventControllerContext)

  const {events} = useContext(EventModelContext);
  const [selectedDate, setSelectedDate] = useState<Date>(findEarliestEventDate(events));

  
  useEffect(() => {
      setSelectedDate(findEarliestEventDate(events));
  }, [events]);

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
