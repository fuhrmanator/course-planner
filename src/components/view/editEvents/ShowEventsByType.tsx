import React, { useContext, useState } from "react";
import moment from "moment";
import { EventModelContext } from "@/components/model/EventModel";
import {
  CourseEvent,
  EventType,
  CourseType,
  EventDate,
} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import { courseTypeToLabel } from "@/components/model/ressource/eventRessource";
import { DSL_TIME_UNIT_TO_MS } from "@/components/model/ressource/dslRessource";
import { EventControllerContext } from "@/components/controller/eventController";



const ShowEventsByType: React.FC = () => {
  const { activityEvents, newCourseEvents } = useContext(EventModelContext);
  const { setEventRelativeDate, notifyEventSelected } = useContext(
    EventControllerContext
  );
  const [clickedActivity, setClickedActivity] = useState<CourseEvent | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<CourseEvent | undefined>();
  const [selectedTime, setSelectedTime] = useState<number | undefined>();
  const [selectedStartOrEnd, setSelectedStartOrEnd] = useState<
    "start" | "end" | undefined
  >();
  const [selectedAdjustment, setSelectedAdjustment] = useState<
    "+" | "-" | undefined
  >();
  const [timeInput, setTimeInput] = useState<string>("");

  const handleActivityClick = (activity: CourseEvent) => {

    console.log("handleActivityClick called");
    console.log("activity:", activity);

    setClickedActivity(activity)
    setSelectedEvent(activity);
    setSelectedTime(undefined);
    setSelectedStartOrEnd(undefined);
    setSelectedAdjustment(undefined);
  };

  const handleEventChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {

    const eventUid = event.target.value;
    const selectedEvent = newCourseEvents.find(
      (event) => event.uid === eventUid
    );
    setSelectedEvent(selectedEvent);
    if (selectedEvent) {
      notifyEventSelected(selectedEvent);
    }
  };

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTime = parseInt(event.target.value, 10);
        setSelectedTime(selectedTime);
    };

    const handleStartOrEndChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStartOrEnd = event.target.value as "start" | "end";
        setSelectedStartOrEnd(selectedStartOrEnd);
    };

    const handleTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeInput(event.target.value);
    };

    const handleSave = () => {
      if (
        clickedActivity &&
        selectedEvent &&
        selectedTime &&
        timeInput &&
        !isNaN(parseInt(timeInput)) &&
        selectedStartOrEnd
      ) {
        
        console.log(clickedActivity.title)
        console.log(selectedEvent.title)
        console.log(selectedTime)
        console.log(timeInput)
        console.log(selectedStartOrEnd)
        
        // Call the setEventRelativeDate function with the updated selectedEvent
        setEventRelativeDate(clickedActivity,selectedEvent,selectedStartOrEnd,parseInt(timeInput), selectedTime);
        setSelectedEvent(undefined);
        setSelectedTime(undefined);
        setSelectedStartOrEnd(undefined);
        setTimeInput("");
      }
    };
    
    
      

    const handleCancel = () => {
        setSelectedEvent(undefined);
        setSelectedTime(undefined);
        setSelectedStartOrEnd(undefined);
        setTimeInput("");
    };

    const filteredCourseEvents: { [key: string]: CourseEvent[] } = {};
    newCourseEvents.forEach((event) => {
        const eventType = event.type;
        const eventTypeLabel = courseTypeToLabel[eventType as keyof typeof courseTypeToLabel];
        if (!filteredCourseEvents[eventTypeLabel]) {
            filteredCourseEvents[eventTypeLabel] = [];
        }
        filteredCourseEvents[eventTypeLabel].push(event);
    });

    const formattedCourseEvents = Object.keys(filteredCourseEvents).reduce((acc, eventTypeLabel) => {
        const courseEvents = filteredCourseEvents[eventTypeLabel];
        const formattedEvents = courseEvents.map((courseEvent, index) => ({
            ...courseEvent,
            title: `${eventTypeLabel} ${index + 1}`,
        }));
        return [...acc, ...formattedEvents];
    }, [] as CourseEvent[]);


    

  

    return (
        <div className={styles.container}>
        <div className={styles.col}>
          <h2>Événements</h2>
          {activityEvents.map((activity) => (
            <div
              key={activity.uid}
              onClick={() => handleActivityClick(activity)}
              className={styles.activity}
            >
              <div className={styles.title}>{activity.title}</div>
              <div className={styles.date}>
                {moment(activity.start).format("LLL")}
              </div>
            </div>
          ))}
        </div>
            {selectedEvent && (
                <div className={styles.col}>
                    <h2>{selectedEvent.title}</h2>
                    <select value={selectedEvent?.uid ?? ""} onChange={handleEventChange}>
                        <option value="">Select event</option>
                        {formattedCourseEvents.map(event => (
                            <option key={event.uid} value={event.uid}>{event.title + event.start}</option>
                        ))}
                    </select>
                    <select value={selectedStartOrEnd ?? ""} onChange={handleStartOrEndChange}>
                        <option value="">Début ou Fin</option>
                        <option value={EventDate.Start}>Début</option>
                        <option value={EventDate.End}>Fin</option>
                    </select>

                    <input type="number" value={timeInput} onChange={handleTimeInputChange}/>
                    <select value={selectedTime ?? ""} onChange={handleTimeChange}>
                        <option value="">Select time</option>
                        {Object.entries(DSL_TIME_UNIT_TO_MS).map(([unit, value]) => (
                            <option key={unit} value={value}>{unit}</option>
                        ))}
                    </select>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};
export default ShowEventsByType;
