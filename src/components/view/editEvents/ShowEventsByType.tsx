import React, {useContext, useEffect, useState} from "react";
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


const ShowEventsByType: React.FC = () => {
    const {activityEvents, newCourseEvents, selectedEvent} = useContext(EventModelContext);
    const {setEventRelativeDate, notifyEventSelected, notifySaveChanges, notifyCancelChanges} = useContext(EventControllerContext);

    const [selectedActivity, setSelectedActivity] = useState<CourseEvent | undefined>();
    const [selectedCourse, setSelectedCourse] = useState<CourseEvent | undefined>();
    const [selectedTime, setSelectedTime] = useState<number | undefined>();
    const [selectedStartOrEnd, setSelectedStartOrEnd] = useState<EventDate | undefined>();
    const [selectedAdjustment, setSelectedAdjustment] = useState<"+" | "-" | undefined>();
    const [timeInput, setTimeInput] = useState<string>("");
    const [timeUnit, setTimeUnit] = useState<string>("");

    const validateInput = ():boolean => {
        return typeof selectedActivity !== "undefined" &&
            typeof selectedTime !== "undefined"&&
            typeof timeInput !== "undefined" &&
            !isNaN(parseInt(timeInput)) &&
            typeof  selectedStartOrEnd !== "undefined" &&
            typeof selectedCourse !== "undefined";
    }

    useEffect(()=> {
        if (typeof selectedEvent === "undefined") {
            setSelectedActivity(selectedEvent);
        } else if (selectedEvent.type in activityTypeToLabel) {
            setSelectedActivity(getUnsavedStateParent(selectedEvent, activityEvents));
        }
    }, [selectedEvent])

    useEffect(()=> {
        if (validateInput()) {
            setEventRelativeDate(selectedActivity!, selectedCourse!, selectedStartOrEnd as EventDate, timeUnit as DSLTimeUnit, parseInt(timeInput), selectedTime!);
        }
    }, [selectedTime, selectedStartOrEnd, selectedAdjustment, timeInput, timeUnit])

    const handleActivityClick = (activity: CourseEvent) => {

        console.log("handleActivityClick called");
        console.log("activity:", activity);

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

    const handleTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeInput(event.target.value);
    };

    const handleSave = () => {
        if (validateInput()) {

            console.log(selectedEvent?.title)
            console.log(selectedTime)
            console.log(timeInput)
            console.log(selectedStartOrEnd)

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
                <div className={styles.col}>
                    <h2>{selectedActivity.title}</h2>
                    <select value={selectedCourse?.uid ?? ""} onChange={handleEventChange}>
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
                        {Object.entries(DSL_TIME_UNIT_TO_LABEL).map(([unit, value]) =>  (
                            <option key={unit} value={unit}>{value}</option>
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
