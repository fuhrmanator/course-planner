import React, {useContext, useState} from "react";
import moment from "moment";
import {EventModelContext} from "@/components/model/EventModel";
import {CourseEvent, EventType, CourseType} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {courseTypeToLabel} from "@/components/model/ressource/eventRessource";
import {DSL_TIME_UNIT_TO_MS} from "@/components/model/ressource/dslRessource";
import {EventControllerContext} from "@/components/controller/eventController";

const ShowEventsByType: React.FC = () => {
    const {activityEvents, newCourseEvents} = useContext(EventModelContext);
    const {setEventRelativeDate} = useContext(EventControllerContext);
    const [selectedActivity, setSelectedActivity] = useState<CourseEvent | undefined>();
    const [selectedEvent, setSelectedEvent] = useState<CourseEvent | undefined>();
    const [selectedTime, setSelectedTime] = useState<number | undefined>();
    const [selectedStartOrEnd, setSelectedStartOrEnd] = useState<"start" | "end" | undefined>();
    const [selectedAdjustment, setSelectedAdjustment] = useState<"+" | "-" | undefined>();
    const [timeInput, setTimeInput] = useState<string>("");

    const handleActivityClick = (activity: CourseEvent) => {
        setSelectedActivity(activity);
        setSelectedEvent(undefined);
        setSelectedTime(undefined);
        setSelectedStartOrEnd(undefined);
        setSelectedAdjustment(undefined);
    };

    const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const eventUid = event.target.value;
        const selectedEvent = newCourseEvents.find((event) => event.uid === eventUid);
        setSelectedEvent(selectedEvent);
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTime = parseInt(event.target.value, 10);
        setSelectedTime(selectedTime);
    };

    const handleStartOrEndChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStartOrEnd = event.target.value as "start" | "end";
        setSelectedStartOrEnd(selectedStartOrEnd);
    };

    const handleAdjustmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAdjustment = event.target.value as "+" | "-";
        setSelectedAdjustment(selectedAdjustment);
    };

    const handleTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeInput(event.target.value);
    };

    const handleSave = () => {
        if (selectedActivity && selectedEvent && selectedStartOrEnd && selectedTime && selectedAdjustment) {
            setEventRelativeDate(selectedActivity, selectedEvent, selectedStartOrEnd, selectedAdjustment, selectedTime);
            setSelectedActivity(undefined);
            setSelectedEvent(undefined);
            setSelectedTime(undefined);
            setSelectedStartOrEnd(undefined);
            setSelectedAdjustment(undefined);
            setTimeInput("");
        }
    };

    const handleCancel = () => {
        setSelectedActivity(undefined);
        setSelectedEvent(undefined);
        setSelectedTime(undefined);
        setSelectedStartOrEnd(undefined);
        setSelectedAdjustment(undefined);
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
                {activityEvents.filter(activity => activity.type === EventType.Homework || activity.type === EventType.Evaluation)
                    .map(activity => (
                        <div key={activity.uid} onClick={() => handleActivityClick(activity)}
                             className={styles.activity}>
                            <div className={styles.title}>{activity.title}</div>
                            <div className={styles.date}>{moment(activity.start).format("LLL")}</div>
                        </div>
                    ))}
            </div>
            {selectedActivity && (
                <div className={styles.col}>
                    <h2>{selectedActivity.title}</h2>
                    <select value={selectedEvent?.uid ?? ""} onChange={handleEventChange}>
                        <option value="">Select event</option>
                        {formattedCourseEvents.map(event => (
                            <option key={event.uid} value={event.uid}>{event.title}</option>
                        ))}
                    </select>
                    <select value={selectedStartOrEnd ?? ""} onChange={handleStartOrEndChange}>
                        <option value="">Début ou Fin</option>
                        <option value="start">Début</option>
                        <option value="end">Fin</option>
                    </select>
                    <input type="number" value={timeInput} onChange={handleTimeInputChange}/>
                    <select value={selectedTime ?? ""} onChange={handleTimeChange}>
                        <option value="">Select time</option>
                        {Object.entries(DSL_TIME_UNIT_TO_MS).map(([unit, value]) => (
                            <option key={unit} value={value}>{unit}</option>
                        ))}
                    </select>
                    <select value={selectedAdjustment ?? ""} onChange={handleAdjustmentChange}>
                        <option value="">Ajustement</option>
                        <option value="+">+</option>
                        <option value="-">-</option>
                    </select>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};
export default ShowEventsByType;