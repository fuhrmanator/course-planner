import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import moment from "moment";
import {EventModelContext} from "@/components/model/EventModel";
import {
    CourseEvent,
    EventType,
    CourseType, ActivityType, ActivityEvent,
} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {activityTypeToLabel, courseTypeToLabel} from "@/components/model/ressource/eventRessource";
import {DSL_TIME_UNIT_TO_LABEL, DSL_TIME_UNIT_TO_MS} from "@/components/model/ressource/dslRessource";
import {EventControllerContext} from "@/components/controller/eventController";
import {DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {
    getUnsavedStateOrParent,
    getUnsavedStateParent,
    hasDueDate, hasUnsavedState
} from "@/components/controller/util/eventsOperations";
import ActivityDetail from './ActivityDetail';

const ShowEventsByType: React.FC = () => {

    const {activityEvents, newCourseEvents, selectedEvent} = useContext(EventModelContext);
    const {
        setEventRelativeDate,
        notifyEventSelected,
        notifySaveChanges,
        notifyCancelChanges
    } = useContext(EventControllerContext);


    const [selectedActivity, setSelectedActivity] = useState<CourseEvent | undefined>();
    const [selectedCourse, setSelectedCourse] = useState<CourseEvent | undefined>();
    const [selectedTime, setSelectedTime] = useState<number>(0);
    const [selectedStartOrEnd, setSelectedStartOrEnd] = useState<EventDate | undefined>();
    const [selectedAdjustment, setSelectedAdjustment] = useState<"+" | "-" | undefined>();
    const [timeInput, setTimeInput] = useState<number>(0);
    const [timeUnit, setTimeUnit] = useState<string>("");
    const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

    const validateInput = (
        selectedActivity: CourseEvent | undefined,
        selectedTime: number | undefined,
        selectedCourse: CourseEvent | undefined,
        selectedStartOrEnd: EventDate | undefined
    ): boolean => {
        const isValid =
            typeof selectedActivity !== "undefined" &&
            typeof timeInput !== "undefined" &&
            typeof selectedCourse !== "undefined" &&
            typeof selectedStartOrEnd !== "undefined";

        if (!isValid) {
            console.log("Missing variables:", {
                selectedActivity,
                timeInput,
                selectedStartOrEnd,
                selectedCourse,
            });
        }

        return isValid;
    };


    useEffect(() => {
        if (typeof selectedEvent === "undefined") {
            setSelectedActivity(selectedEvent);
        } else if (selectedEvent.type in activityTypeToLabel) {
            setSelectedActivity(getUnsavedStateParent(selectedEvent, activityEvents) as ActivityEvent);
        }
    }, [selectedEvent])

    useEffect(() => {
        setIsSaveDisabled(typeof selectedActivity === "undefined" || !hasUnsavedState(selectedActivity))
    }, [selectedActivity])

    const handleActivityClick = (activity: CourseEvent) => {
        notifyEventSelected(getUnsavedStateOrParent(activity));
        setSelectedTime(0);
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
        setTimeInput(parseInt(value));
        console.log(`timeInput: ${value}`);
    };

    const handleSave = () => {
        if (typeof selectedActivity !== "undefined") {
            notifySaveChanges(selectedActivity);
        }
    };

    const handleChange = (selectedStartOrEnd: EventDate) => {
        notifyEventSelected(getUnsavedStateOrParent(selectedActivity!))
    };

    const handleCancel = () => {
        if (typeof selectedActivity !== "undefined") {
            notifyCancelChanges(selectedActivity);
        }
        setSelectedTime(0);
        setSelectedStartOrEnd(undefined);
        setTimeInput(0);
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

    const handleLocalTimeInputChange = (value: number) => {
        setTimeInput(value);
    };

    const handleSelectedCourseChange = (course: CourseEvent | undefined) => {
        setSelectedCourse(course);
    };

    const handleSelectedStartOrEndChange = (startOrEnd: EventDate | undefined) => {
        setSelectedStartOrEnd(startOrEnd);
        console.log("handleSelectedStartOrEndChange function: " + startOrEnd)
    };

    const handleSelectedTimeChange = (time: number) => {
        setSelectedTime(time);
    };


    return (
        <div className={styles.font}>
            <h2>Événements</h2>
            <div className={styles.container}>
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
                                selectedTime={selectedTime}
                                timeInput={timeInput}
                                formattedCourseEvents={formattedCourseEvents}
                                handleEventChange={handleEventChange}
                                handleStartOrEndChange={handleStartOrEndChange}
                                handleTimeInputChange={handleTimeInputChange}
                                handleTimeChange={handleTimeChange}
                                onTimeInputChange={handleLocalTimeInputChange}
                                onSelectedCourseChange={handleSelectedCourseChange}
                                onSelectedTimeChange={handleSelectedTimeChange}
                                handleSave={() => handleChange(EventDate.Start)}
                                selectedStartOrEnd={EventDate.Start}

                            />
                            <h3>Fin</h3>
                            <ActivityDetail
                                key={`${selectedActivity.uid}-end`}
                                selectedActivity={selectedActivity}
                                selectedCourse={selectedCourse}
                                selectedTime={selectedTime}
                                timeInput={timeInput}
                                formattedCourseEvents={formattedCourseEvents}
                                handleEventChange={handleEventChange}
                                handleStartOrEndChange={handleStartOrEndChange}
                                handleTimeInputChange={handleTimeInputChange}
                                handleTimeChange={handleTimeChange}
                                onTimeInputChange={handleLocalTimeInputChange}
                                onSelectedCourseChange={handleSelectedCourseChange}
                                onSelectedTimeChange={handleSelectedTimeChange}
                                handleSave={() => handleChange(EventDate.End)}
                                selectedStartOrEnd={EventDate.End}

                            />


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
                                selectedTime={selectedTime}
                                timeInput={timeInput}
                                formattedCourseEvents={formattedCourseEvents}
                                handleEventChange={handleEventChange}
                                handleStartOrEndChange={handleStartOrEndChange}
                                handleTimeInputChange={handleTimeInputChange}
                                handleTimeChange={handleTimeChange}
                                onTimeInputChange={handleLocalTimeInputChange}
                                onSelectedCourseChange={handleSelectedCourseChange}
                                onSelectedTimeChange={handleSelectedTimeChange}
                                handleSave={() => handleChange(EventDate.Start)}
                                selectedStartOrEnd={EventDate.Start}

                            />
                            <h3>Remise</h3>
                            <ActivityDetail
                                key={`${selectedActivity.uid}-due`}
                                selectedActivity={selectedActivity}
                                selectedCourse={selectedCourse}
                                selectedTime={selectedTime}
                                timeInput={timeInput}
                                formattedCourseEvents={formattedCourseEvents}
                                handleEventChange={handleEventChange}
                                handleStartOrEndChange={handleStartOrEndChange}
                                handleTimeInputChange={handleTimeInputChange}
                                handleTimeChange={handleTimeChange}
                                onTimeInputChange={handleLocalTimeInputChange}
                                onSelectedCourseChange={handleSelectedCourseChange}
                                onSelectedTimeChange={handleSelectedTimeChange}
                                handleSave={() => handleChange(EventDate.Due)}
                                selectedStartOrEnd={EventDate.Due}
                            />
                            <h3>Fin</h3>
                            <ActivityDetail
                                key={`${selectedActivity.uid}-cutoff`}
                                selectedActivity={selectedActivity}
                                selectedCourse={selectedCourse}
                                selectedTime={selectedTime}
                                timeInput={timeInput}
                                formattedCourseEvents={formattedCourseEvents}
                                handleEventChange={handleEventChange}
                                handleStartOrEndChange={handleStartOrEndChange}
                                handleTimeInputChange={handleTimeInputChange}
                                handleTimeChange={handleTimeChange}
                                onTimeInputChange={handleLocalTimeInputChange}
                                onSelectedCourseChange={handleSelectedCourseChange}
                                onSelectedTimeChange={handleSelectedTimeChange}
                                handleSave={() => handleChange(EventDate.CutOff)}
                                selectedStartOrEnd={EventDate.CutOff}
                            />

                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    )}
                </>
            )}
            <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={styles.button}
            >
                <div className={styles.font}>
                    Sauvegarder
                </div>
            </button>

        </div>
    );
};

export default ShowEventsByType;