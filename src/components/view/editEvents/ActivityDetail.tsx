import {ActivityDateProp, ActivityEvent, CourseEvent} from "@/components/model/interfaces/courseEvent";
import {DSLDateRef, DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {DSL_TIME_UNIT_TO_LABEL} from "@/components/model/ressource/dslRessource";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {EventControllerContext} from "@/components/controller/eventController";
import {COURSE_DATE_TO_GETTER} from "@/components/model/ressource/eventRessource";
import {validateEvent} from "@/components/controller/util/eventsOperations";
import UI from '@/styles/CoursePlanner.module.css';

type ActivityDetailProps = {
    selectedActivity: CourseEvent;
    courseNameToEvent: { [key: string]: CourseEvent };
    courseDateInformation: ActivityDateProp;
};

const ActivityDetail: React.FC<ActivityDetailProps> = ({
                                                           selectedActivity,
                                                           courseNameToEvent,
                                                           courseDateInformation
                                                       }) => {
    const {setEventRelativeDate} = useContext(EventControllerContext);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
    const [selectedCourseName, setSelectedCourseName] = useState<string>("");
    const [courseDateRef, setCourseDateRef] = useState<string>("");
    const [isOffsetActivated, setIsOffsetActivated] = useState<boolean>(false);
    const [offsetUnit, setOffsetUnit] = useState<string>("");
    const [offsetValue, setOffsetValue] = useState<number|undefined>(0);
    const [isAtActivated, setIsAtActivated] = useState<boolean>(false);
    const [atHours, setAtHours] = useState<number>(0);
    const [atMinutes, setAtMinutes] = useState<number>(0);

    const validateInput = (): boolean => {
        return (isOffsetActivated && selectedCourseName !== "" && offsetUnit !== "" && courseDateRef !== "" && typeof offsetValue !== "undefined") ||
            (!isOffsetActivated && selectedCourseName !== "" && courseDateRef !== "");
    }

    useEffect(() => {
        if (typeof courseDateInformation.getter(selectedActivity) === "undefined") {
            setIsAllDisabled(true);
            setErrorMsg(`L'activité sélectionné n'a pas de date de ${courseDateInformation.label}`)
        }
    }, [selectedActivity])

    useEffect(() => {
        if (validateInput()) {
            try {
                setEventRelativeDate(
                    selectedActivity as ActivityEvent,
                    courseNameToEvent[selectedCourseName!],
                    courseDateInformation.getter,
                    COURSE_DATE_TO_GETTER[courseDateRef as DSLDateRef],
                    courseDateRef as DSLDateRef,
                    isOffsetActivated ? offsetValue! : 0,
                    offsetUnit === "" ? undefined : offsetUnit as DSLTimeUnit,
                    isAtActivated ? atMinutes : undefined,
                    isAtActivated ? atHours : undefined
                );
                setErrorMsg("");
            } catch (e:any) {
                if (typeof e.message !== "undefined") {
                    setErrorMsg(e.message);
                }
            }
        }
    }, [selectedCourseName, courseDateRef, offsetUnit, offsetValue, isOffsetActivated, offsetValue, offsetUnit, atMinutes, atHours])

    useEffect(()=> {
        try {
            if (selectedActivity.unsavedState !== null && typeof selectedActivity.unsavedState !== "undefined") {
                validateEvent(selectedActivity.unsavedState);
                setErrorMsg("");
            }
        } catch (e:any) {
            if (typeof e.message !== "undefined") {
                setErrorMsg(e.message);
            }
        }
    }, [selectedActivity])

    const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setOffsetValue(isNaN(val) ? undefined : val);
    };

    const handleOffsetUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setOffsetUnit(e.target.value)
    };

    const handleCourseDateRefChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setCourseDateRef(e.target.value)
    };

    const handleOffsetCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsOffsetActivated(e.target.checked);
    }

    const handleAtCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAtActivated(e.target.checked);
    }

    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCourseName(e.target.value);
    }

    const handleAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parts = (e.target.value).split(":");
        setAtHours(parseInt(parts[0]))
        setAtMinutes(parseInt(parts[1]))
    }
    return (
        <div className={styles.detail}>
            <select
                disabled={isAllDisabled}
                value={selectedCourseName}
                onChange={handleCourseChange}>
                <option key="" value="">Select event</option>
                {Object.keys(courseNameToEvent).map((courseName: string) => (
                    <option key={courseNameToEvent[courseName].uid} value={courseName}>
                        {courseName}
                    </option>
                ))}
            </select>
            <select
                disabled={isAllDisabled}
                value={courseDateRef}
                onChange={handleCourseDateRefChange}>
                <option key="" value="">Select course date ref.</option>
                {Object.keys(COURSE_DATE_TO_GETTER).map((courseRef: string) => (
                    <option key={courseRef} value={courseRef}>
                        {courseRef}
                    </option>
                ))}
            </select>
            <h3 className={styles.font}>Décalage: </h3>
            <input disabled={isAllDisabled} type="checkbox" checked={isOffsetActivated} onChange={handleOffsetCheckChange}/>
            <input disabled={!isOffsetActivated || isAllDisabled}
                   type="number"
                   defaultValue={offsetValue}
                   onChange={handleOffsetChange}/>
            <select
                disabled={!isOffsetActivated || isAllDisabled}
                value={offsetUnit}
                onChange={handleOffsetUnitChange}>
                <option key="" value="">Select time</option>
                {Object.entries(DSL_TIME_UNIT_TO_LABEL).map(([unit, value]) => (
                    <option key={unit} value={unit}>
                        {value}
                    </option>
                ))}
            </select>
            <input disabled={isAllDisabled} type="checkbox" checked={isAtActivated} onChange={handleAtCheckboxChange}/>
            <input disabled={!isAtActivated || isAllDisabled}
                   type="time"
                   defaultValue={""}
                   onChange={handleAtChange}/>
            <p className={styles.error}>{errorMsg}</p>
        </div>
    );
};

export default ActivityDetail;

