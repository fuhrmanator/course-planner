import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import moment from "moment";
import {EventModelContext} from "@/components/model/EventModel";
import {
    CourseEvent,
    EventType,
    CourseType,
    EventDate, ActivityType,
} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {activityTypeToLabel, courseTypeToLabel} from "@/components/model/ressource/eventRessource";
import {DSL_TIME_UNIT_TO_LABEL, DSL_TIME_UNIT_TO_MS} from "@/components/model/ressource/dslRessource";
import {EventControllerContext} from "@/components/controller/eventController";
import {DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {getUnsavedStateOrParent, getUnsavedStateParent} from "@/components/controller/util/eventsOperations";
import ActivityDetail from './ActivityDetail';

const ShowEventsByType: React.FC = () => {
  const {activityEvents, newCourseEvents, selectedEvent} = useContext(EventModelContext);
  const {setEventRelativeDate, notifyEventSelected, notifySaveChanges, notifyCancelChanges} = useContext(EventControllerContext);

  const [selectedActivity, setSelectedActivity] = useState<CourseEvent | undefined>();
  const [selectedCourse, setSelectedCourse] = useState<CourseEvent | undefined>();
  const [selectedTime, setSelectedTime] = useState<number | undefined>();
  const [selectedStartOrEnd, setSelectedStartOrEnd] = useState<EventDate | undefined>();
  const [selectedAdjustment, setSelectedAdjustment] = useState<"+" | "-" | undefined>();
  const [timeInput, setTimeInput] = useState('');
  const [timeUnit, setTimeUnit] = useState<string>("");




  const validateInput = (): boolean => {
    const isValid =
      typeof selectedActivity !== "undefined" &&
      typeof selectedTime !== "undefined" &&
      typeof timeInput !== "undefined" &&
      !isNaN(parseInt(timeInput)) &&
      typeof selectedStartOrEnd !== "undefined" &&
      typeof selectedCourse !== "undefined";
  
    if (!isValid) {
      console.log("Missing variables:", {
        selectedActivity,
        selectedTime,
        timeInput,
        selectedStartOrEnd,
        selectedCourse,
      });
    }
  
    return isValid;
  };
  
  

  useEffect(()=> {
    if (typeof selectedEvent === "undefined") {
      setSelectedActivity(selectedEvent);
    } else if (selectedEvent.type in activityTypeToLabel) {
      setSelectedActivity(getUnsavedStateParent(selectedEvent, activityEvents));
    }
  }, [selectedEvent])

  useEffect(()=> {
    if (validateInput()) {
      setEventRelativeDate(selectedActivity!, selectedCourse!, selectedStartOrEnd as EventDate, parseInt(timeInput), selectedTime!);
    }
  }, [selectedTime, selectedStartOrEnd, selectedAdjustment, timeInput])

  const handleActivityClick = (activity: CourseEvent) => {
    notifyEventSelected(getUnsavedStateOrParent(activity));
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
    setSelectedCourse(selectedEvent)
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const unitName = event.target.value as DSLTimeUnit;
    const selectedTime = DSL_TIME_UNIT_TO_MS[unitName];
    setSelectedTime(selectedTime);
    setTimeUnit(unitName);
  };
  const handleStartOrEndChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStartOrEnd = event.target.value as EventDate;
    setSelectedStartOrEnd(selectedStartOrEnd);
  };

  const handleTimeInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeInput(value);
    console.log(`timeInput: ${value}`);
  };
  
  


  const handleSave = () => {
    console.log(selectedActivity?.title + "Activity")
    console.log(selectedCourse?.title + "Course")
    if (validateInput() && selectedActivity && selectedStartOrEnd && selectedCourse && selectedTime) {
      const keys = selectedActivity.type === EventType.Evaluation ? ["start", "end"] : ["start", "cutoff", "end"];
  
      keys.forEach((key) => {
        console.log(`Key: ${selectedActivity.uid}-${key}`);
        setEventRelativeDate(selectedActivity, selectedCourse, selectedStartOrEnd, timeUnit as DSLTimeUnit, parseInt(timeInput), selectedTime);
      });
      notifySaveChanges(selectedActivity);
    }
  };

  const handleCancel = () => {
    if (typeof selectedActivity !== "undefined") {
      notifyCancelChanges(selectedActivity);
    }
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

  const handleLocalTimeInputChange = (value: string) => {
    setTimeInput(value);
  };
  
  const handleSelectedCourseChange = (course: CourseEvent | undefined) => {
    setSelectedCourse(course);
  };
  
  const handleSelectedStartOrEndChange = (startOrEnd: EventDate | undefined) => {
    setSelectedStartOrEnd(startOrEnd);
  };
  
  const handleSelectedTimeChange = (time: number | undefined) => {
    setSelectedTime(time);
  };

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
        {selectedActivity && (
<>
{selectedActivity.type === EventType.Evaluation && (
  <div>
    <h3>Début</h3>
    <ActivityDetail
      key={`${selectedActivity.uid}-start`}
      selectedActivity={selectedActivity}
      selectedCourse={selectedCourse}
      selectedStartOrEnd={selectedStartOrEnd}
      selectedTime={selectedTime}
      timeInput={timeInput}
      formattedCourseEvents={formattedCourseEvents}
      handleEventChange={handleEventChange}
      handleStartOrEndChange={handleStartOrEndChange}
      handleTimeInputChange={handleTimeInputChange}
      handleTimeChange={handleTimeChange}
      onTimeInputChange={handleLocalTimeInputChange}
      onSelectedCourseChange={handleSelectedCourseChange}
      onSelectedStartOrEndChange={handleSelectedStartOrEndChange}
      onSelectedTimeChange={handleSelectedTimeChange}
  
    />
    <h3>Fin</h3>
    <ActivityDetail
      key={`${selectedActivity.uid}-end`}
      selectedActivity={selectedActivity}
      selectedCourse={selectedCourse}
      selectedStartOrEnd={selectedStartOrEnd}
      selectedTime={selectedTime}
      timeInput={timeInput}
      formattedCourseEvents={formattedCourseEvents}
      handleEventChange={handleEventChange}
      handleStartOrEndChange={handleStartOrEndChange}
      handleTimeInputChange={handleTimeInputChange}
      handleTimeChange={handleTimeChange}
      onTimeInputChange={handleLocalTimeInputChange}
      onSelectedCourseChange={handleSelectedCourseChange}
      onSelectedStartOrEndChange={handleSelectedStartOrEndChange}
      onSelectedTimeChange={handleSelectedTimeChange}
     
    />
    <button onClick={handleSave}>Save</button>
    <button onClick={handleCancel}>Cancel</button>
  </div>
)}
{selectedActivity.type === EventType.Homework && (
  <div>
    <h3>Début</h3>
    <ActivityDetail
      key={`${selectedActivity.uid}-start`}
      selectedActivity={selectedActivity}
      selectedCourse={selectedCourse}
      selectedStartOrEnd={selectedStartOrEnd}
      selectedTime={selectedTime}
      timeInput={timeInput}
      formattedCourseEvents={formattedCourseEvents}
      handleEventChange={handleEventChange}
      handleStartOrEndChange={handleStartOrEndChange}
      handleTimeInputChange={handleTimeInputChange}
      handleTimeChange={handleTimeChange}
      onTimeInputChange={handleLocalTimeInputChange}
      onSelectedCourseChange={handleSelectedCourseChange}
      onSelectedStartOrEndChange={handleSelectedStartOrEndChange}
      onSelectedTimeChange={handleSelectedTimeChange}

    />
    <h3>CutOff</h3>
    <ActivityDetail
      key={`${selectedActivity.uid}-cutoff`}
      selectedActivity={selectedActivity}
      selectedCourse={selectedCourse}
      selectedStartOrEnd={selectedStartOrEnd}
      selectedTime={selectedTime}
      timeInput={timeInput}
      formattedCourseEvents={formattedCourseEvents}
      handleEventChange={handleEventChange}
      handleStartOrEndChange={handleStartOrEndChange}
      handleTimeInputChange={handleTimeInputChange}
      handleTimeChange={handleTimeChange}
      onTimeInputChange={handleLocalTimeInputChange}
      onSelectedCourseChange={handleSelectedCourseChange}
      onSelectedStartOrEndChange={handleSelectedStartOrEndChange}
      onSelectedTimeChange={handleSelectedTimeChange}
      
    />
    <h3>Fin</h3>
    <ActivityDetail
      key={`${selectedActivity.uid}-end`}
      selectedActivity={selectedActivity}
      selectedCourse={selectedCourse}
      selectedStartOrEnd={selectedStartOrEnd}
      selectedTime={selectedTime}
      timeInput={timeInput}
      formattedCourseEvents={formattedCourseEvents}
      handleEventChange={handleEventChange}
      handleStartOrEndChange={handleStartOrEndChange}
      handleTimeInputChange={handleTimeInputChange}
      handleTimeChange={handleTimeChange}
      onTimeInputChange={handleLocalTimeInputChange}
      onSelectedCourseChange={handleSelectedCourseChange}
      onSelectedStartOrEndChange={handleSelectedStartOrEndChange}
      onSelectedTimeChange={handleSelectedTimeChange}
      
     
    />
    <button onClick={handleSave}>Save</button>
    <button onClick={handleCancel}>Cancel</button>
  </div>
)}
</>
)}


</div>
);
};

export default ShowEventsByType;