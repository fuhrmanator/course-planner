import React, { useContext, useEffect, useState } from "react";
import { EventModelContext } from "@/components/model/eventModel";
import { EventControllerContext } from "@/components/controller/eventController";
import { EventSelectionContext } from "@/components/view/eventCalendar";

interface UpdateEventProps {}

const UpdateEventButton: React.FC<UpdateEventProps> = () => {
  const { notifyUpdateEvent } = useContext(EventControllerContext);
  const selectedEvent = useContext(EventSelectionContext);

  const [newStartDate, setNewStartDate] = useState<Date>(
    selectedEvent?.start ? new Date(selectedEvent.start) : new Date()
  );
  const [newEndDate, setNewEndDate] = useState<Date>(
    selectedEvent?.end ? new Date(selectedEvent.end) : new Date()
  );
  const [defaultStartDate, setDefaultStartDate] = useState<Date | null>(
    selectedEvent?.start ? new Date(selectedEvent.start) : null
  );
  const [defaultEndDate, setDefaultEndDate] = useState<Date | null>(
    selectedEvent?.end ? new Date(selectedEvent.end) : null
  );
  useEffect(() => {
    setDefaultStartDate(
      selectedEvent?.start ? new Date(selectedEvent.start) : null
    );
    setDefaultEndDate(selectedEvent?.end ? new Date(selectedEvent.end) : null);
    setNewStartDate(
      selectedEvent?.start ? new Date(selectedEvent.start) : new Date()
    );
    setNewEndDate(
      selectedEvent?.end ? new Date(selectedEvent.end) : new Date()
    );
  }, [selectedEvent]);
  const onStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStartDate(new Date(e.target.value));
  };

  const onEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEndDate(new Date(e.target.value));
  };

  const resetDates = () => {
    setNewStartDate(defaultStartDate || new Date());
    setNewEndDate(defaultEndDate || new Date());
  };

  const handleDateChange = () => {
    if (selectedEvent) {
      console.log("les valeurs de l evenment quand on click ");
      console.log(selectedEvent);
      notifyUpdateEvent(selectedEvent, newStartDate, newEndDate);
    }
  };
  return (
    <div>
      {selectedEvent ? (
        <>
          <h2>Activité est : {selectedEvent.title}</h2>
          <label htmlFor="start">Date et heure de début:</label>
          <br />
          <input
            type="datetime-local"
            id="start"
            value={newStartDate.toISOString().substr(0, 16)}
            onChange={onStartDateChange}
          />
          <br />
          <label htmlFor="end">Date et heure de fin:</label>
          <br />
          <input
            type="datetime-local"
            id="end"
            value={newEndDate.toISOString().substr(0, 16)}
            onChange={onEndDateChange}
          />
          <br />
          <br />
          <button onClick={handleDateChange}>Changer les dates</button>
          <button onClick={resetDates}>Réinitialiser</button>
        </>
      ) : (
        <p>No event selected</p>
      )}
    </div>
  );
};

export default UpdateEventButton;
