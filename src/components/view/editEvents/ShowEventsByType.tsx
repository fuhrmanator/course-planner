import React, {useContext, useEffect, useState} from "react";
import moment from "moment";
import {EventModelContext} from "@/components/model/EventModel";
import {
    ActivityDateProp,
    ActivityType,
    CourseEvent,
    CourseType,
    EventWithName,
} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {
    ACTIVITY_TYPE_TO_DATE_PROP,
    ACTIVITY_TYPE_TO_LABEL,
    COURSE_TYPE_TO_LABEL
} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/EventController";
import {
    getKeysAsType,
    getUnsavedStateOrParent,
    getUnsavedStateParent,
    hasUnsavedState,
    sortEventsWithTypeByOldestStart, validateEvent
} from "@/components/controller/util/eventsOperations";
import UI from "@/styles/CoursePlanner.module.css";
import ActivityDetail from './ActivityDetail';

const ShowEventsByType: React.FC = () => {

    const {activityEvents, newCourseEvents, selectedEvent} = useContext(EventModelContext);
    const {
        notifyEventSelected,
        notifySaveChanges,
        notifyCancelChanges
    } = useContext(EventControllerContext);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [selectedActivity, setSelectedActivity] = useState<CourseEvent | undefined>();
    const [selectedActivityDates, setSelectedActivityDates] = useState<ActivityDateProp[]>([]);
    const [formattedCourseEvents, setFormattedCourseEvents] = useState<EventWithName[]>([]);
    const [isSaveAndCancelDisabled, setIsSaveAndCancelDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (typeof selectedEvent === "undefined") {
            setSelectedActivity(selectedEvent);
            setSelectedActivityDates([]);
            setIsSaveAndCancelDisabled(true);
        } else if (selectedEvent.type in ACTIVITY_TYPE_TO_LABEL) {
            const parent = getUnsavedStateParent(selectedEvent, activityEvents)

            setSelectedActivity(parent);
            setSelectedActivityDates([...ACTIVITY_TYPE_TO_DATE_PROP[selectedEvent.type as ActivityType]]);
            setIsSaveAndCancelDisabled(typeof parent === "undefined" ? true : !hasUnsavedState(parent))

            // Highlight the selected event
            const selectedElement = document.querySelector(`[data-event-id="${selectedEvent.uid}"]`);
            if (selectedElement) {
                selectedElement.classList.add(styles.selected);
            }
        }
        checkError();
    }, [selectedEvent, activityEvents])

    const checkError = ():void => {
        try {
            if (typeof selectedEvent !== "undefined") {
                validateEvent(selectedEvent)
            }
            setErrorMsg("");
        } catch (e:any) {
            if (typeof e.message !== "undefined") {
                setErrorMsg(e.message);
            }
        }
    }

    useEffect(() => {
        const formatted: EventWithName[] = [];
        for (const courseType of getKeysAsType<CourseType>(COURSE_TYPE_TO_LABEL)) {
            const courseEventOfType = sortEventsWithTypeByOldestStart(newCourseEvents, courseType);
            for (let i = 0; i < courseEventOfType.length; i++) {
                formatted.push({
                    event:courseEventOfType[i],
                    name:`${COURSE_TYPE_TO_LABEL[courseType]} ${i + 1}`
                })
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
            <h2 className={UI.h2}>Événements</h2>
            <div className={UI.container}>
                {activityEvents.map((activity) => (
                    <div
                        key={activity.uid}
                        onClick={() => handleActivityClick(activity)}
                        className={typeof selectedActivity !== "undefined" && selectedActivity.uid === activity.uid ? `${styles.activity} ${styles.selected}` : styles.activity}
                    >
                        <div className={styles.title}>{activity.title}</div>
                        <div className={styles.date}>
                            {moment(activity.start).format("LLL")}
                        </div>
                    </div>
                ))}
            </div>
            <div>            
                <h2 className={UI.h2}> Activité
                sélectionnée: {typeof selectedActivity === "undefined" ? "" : selectedActivity.title} </h2>

                {selectedActivity && selectedActivityDates.map((selectedActivityDate, index) => (
                    <ActivityDetail key={Math.random()}
                                    selectedActivity={selectedActivity!}
                                    courseWithNames={formattedCourseEvents}
                                    courseDateInformation={selectedActivityDate}
                                    onChange={checkError}/>
                ))}
                <p className={styles.error}>{errorMsg}</p>
                <div className={UI.buttonContainer}>

                    <button
                        onClick={handleSave}
                        disabled={isSaveAndCancelDisabled}
                        className={UI.buttonSauvegarder}>
                        <div className={UI.uiLabel}>
                            Sauvegarder
                        </div>
                    </button>
                    
                    <button
                        onClick={handleCancel}
                        disabled={isSaveAndCancelDisabled}
                        className={UI.buttonCancel}>
                        <div className={UI.uiLabel}>
                            Annuler
                        </div>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ShowEventsByType;