import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import {EventModelContext} from "@/components/model/EventModel";
import {ActivityDateProp, ActivityType, CourseEvent, CourseType,} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {
    ACTIVITY_TYPE_TO_DATE_PROP,
    activityTypeToLabel,
    courseTypeToLabel
} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/eventController";
import {
    getKeysAsType,
    getUnsavedStateOrParent,
    getUnsavedStateParent,
    hasUnsavedState,
    sortEventsWithTypeByOldestStart
} from "@/components/controller/util/eventsOperations";
import ActivityDetail from './ActivityDetail';

const ShowEventsByType: React.FC = () => {

    const {activityEvents, newCourseEvents, selectedEvent} = useContext(EventModelContext);
    const {
        notifyEventSelected,
        notifySaveChanges,
        notifyCancelChanges
    } = useContext(EventControllerContext);


    const [selectedActivity, setSelectedActivity] = useState<CourseEvent | undefined>();
    const [selectedActivityDates, setSelectedActivityDates] = useState<ActivityDateProp[]>([]);
    const [formattedCourseEvents, setFormattedCourseEvents] = useState<{[key: string]:CourseEvent}>({});
    const [isSaveAndCancelDisabled, setIsSaveAndCancelDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (typeof selectedEvent === "undefined") {
            setSelectedActivity(selectedEvent);
            setSelectedActivityDates([]);
            setIsSaveAndCancelDisabled(true);
        } else if (selectedEvent.type in activityTypeToLabel) {
            const parent = getUnsavedStateParent(selectedEvent, activityEvents)
            setSelectedActivity(parent);
            setSelectedActivityDates([...ACTIVITY_TYPE_TO_DATE_PROP[selectedEvent.type as ActivityType]]);
            setIsSaveAndCancelDisabled(typeof parent === "undefined" ? true : !hasUnsavedState(parent))
            // Remove highlight from previously selected event
            const prevSelectedElement = document.querySelector(`.${styles.selected}`);
            if (prevSelectedElement) {
              prevSelectedElement.classList.remove(styles.selected);
            }

            // Highlight the selected event
            const selectedElement = document.querySelector(`[data-event-id="${activityEvents!.uid}"]`);
            if (selectedElement) {
              selectedElement.classList.add(styles.selected);
            }
        }
    }, [selectedEvent, activityEvents])

    useEffect(() => {
        const formatted: {[key: string]:CourseEvent}= {};
        for (const courseType of getKeysAsType<CourseType>(courseTypeToLabel)) {
            const courseEventOfType = sortEventsWithTypeByOldestStart(newCourseEvents, courseType);
            for (let i=0; i<courseEventOfType.length; i++) {
                formatted[`${courseTypeToLabel[courseType]} ${i+1}`] = courseEventOfType[i];
            }
        }
        setFormattedCourseEvents(formatted);
    }, [newCourseEvents])

    const handleActivityClick = (activity: CourseEvent) => {
        notifyEventSelected(getUnsavedStateOrParent(activity));
    };

    const handleSave = () => {
        if (typeof selectedActivity !== "undefined") {
            notifySaveChanges(selectedActivity)
        }
    }

    const handleCancel = () => {
        if (typeof selectedActivity !== "undefined") {
            notifyCancelChanges(selectedActivity)
        }
    }

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
            {selectedActivity && selectedActivityDates.map((selectedActivityDate, index)=> (
                <ActivityDetail key={`${selectedActivity!.uid}-${index}`}
                                selectedActivity={selectedActivity!}
                                courseNameToEvent={formattedCourseEvents}
                                courseDateInformation={selectedActivityDate} />
            ))}
            <button
                onClick={handleSave}
                disabled={isSaveAndCancelDisabled}
                className={styles.button}
            >
                <div className={styles.font}>
                    Sauvegarder
                </div>
            </button>

            <button
                onClick={handleCancel}
                disabled={isSaveAndCancelDisabled}
                className={styles.button}
            >
                <div className={styles.font}>
                    Cancel
                </div>
            </button>

        </div>
    );
};

export default ShowEventsByType;