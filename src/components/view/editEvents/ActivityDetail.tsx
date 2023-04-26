import {ActivityDateProp, ActivityEvent, CourseEvent, EventWithName} from "@/components/model/interfaces/courseEvent";
import {DSLDateRef, DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {DATE_REF_TO_LABEL, DSL_TIME_UNIT_TO_LABEL} from "@/components/model/ressource/dslRessource";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {EventControllerContext} from "@/components/controller/EventController";
import {COURSE_DATE_TO_GETTER} from "@/components/model/ressource/eventRessource";

import UI from '@/styles/CoursePlanner.module.css';
import { Select, Input, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {typeEquality} from "@jest/expect-utils";
import {
    findEventIndexWithType,
    getDSLAtIndex,
    getEventWithTypeAndIndex
} from "@/components/controller/util/eventsOperations";
import {
    getDateAt,
    getDateIndex,
    getDateOffset,
    getDateRef,
    getDateType,
    getDateUnit
} from "@/components/controller/util/dsl/dslOperations";

const { Option } = Select;

type ActivityDetailProps = {
    selectedActivity: CourseEvent;
    courseWithNames: EventWithName[];
    courseDateInformation: ActivityDateProp;
    onChange: () => void;
};

const ActivityDetail: React.FC<ActivityDetailProps> = ({
                                                           selectedActivity,
                                                           courseWithNames,
                                                           courseDateInformation,
                                                           onChange
                                                       }) => {

    const getDefaultActivity = (): string => {
        let courseUID = "";
        if (typeof selectedActivity !== "undefined") {
            const dsl = getDSLAtIndex(selectedActivity, courseDateInformation.dslIndex);
            if (typeof dsl !== "undefined") {
                const courseType = getDateType(dsl);
                const courseIndex = getDateIndex(dsl) - 1;

                const course = getEventWithTypeAndIndex(courseType, courseIndex, courseWithNames.map((e: EventWithName) => e.event));

                if (typeof course !== "undefined") {
                    courseUID = course.uid;
                }
            }
        }
        return courseUID;
    }

    const getDefaultDateRef = (): string => {
        let dateRef = undefined;
        if (typeof selectedActivity !== "undefined") {
            const dsl = getDSLAtIndex(selectedActivity, courseDateInformation.dslIndex);
            if (typeof dsl !== "undefined") {
                dateRef = getDateRef(dsl);
            }
        }
        return typeof dateRef === "undefined" ? "" : dateRef;
    }

    const getDefaultOffset = (): number => {
        let offset = 0;
        if (typeof selectedActivity !== "undefined") {
            const dsl = getDSLAtIndex(selectedActivity, courseDateInformation.dslIndex);
            if (typeof dsl !== "undefined") {
                offset = getDateOffset(dsl);
            }
        }
        return offset;
    }

    const getDefaultUnit = (): string => {
        let unit = undefined;
        if (typeof selectedActivity !== "undefined") {
            const dsl = getDSLAtIndex(selectedActivity, courseDateInformation.dslIndex);
            if (typeof dsl !== "undefined") {
                unit = getDateUnit(dsl);

            }
        }
        return typeof unit === "undefined" ? "" : unit;
    }

    const getDefaultAt = (): string => {
        let at = undefined;
        if (typeof selectedActivity !== "undefined") {
            const dsl = getDSLAtIndex(selectedActivity, courseDateInformation.dslIndex);
            if (typeof dsl !== "undefined") {
                at = getDateAt(dsl);
            }
        }
        return typeof at === "undefined" ? "" : at;
    }

    const {setEventRelativeDate} = useContext(EventControllerContext);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
    const [selectedCourseUID, setSelectedCourseUID] = useState<string>(getDefaultActivity());
    const [courseDateRef, setCourseDateRef] = useState<string>(getDefaultDateRef());
    const [offsetUnit, setOffsetUnit] = useState<string>(getDefaultUnit());
    const [offsetValue, setOffsetValue] = useState<number | undefined>(getDefaultOffset());
    const [isOffsetActivated, setIsOffsetActivated] = useState<boolean>(offsetUnit !== "");
    const [at, setAt] = useState<string>(getDefaultAt());
    const [isAtActivated, setIsAtActivated] = useState<boolean>(at !== "");

    const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

    const validateInput = (): boolean => {
        return (isOffsetActivated && selectedCourseUID !== "" && offsetUnit !== "" && courseDateRef !== "" && typeof offsetValue !== "undefined") ||
            (!isOffsetActivated && selectedCourseUID !== "" && courseDateRef !== "") ||
            (!isOffsetActivated && selectedCourseUID !== "" && isAtActivated && at !== "");
    }

    useEffect(() => {
        if (typeof courseDateInformation.getter(selectedActivity) === "undefined") {
            setIsAllDisabled(true);
            setErrorMsg(`L'activité sélectionné n'a pas de date de ${courseDateInformation.label}`)
        }
    }, [selectedActivity])

    useEffect(() => {
        if (!isFirstRender) {
            if (validateInput()) {
                const selectedCourse = courseWithNames.find((e:EventWithName) => e.event.uid === selectedCourseUID);
                if (typeof selectedCourse !== "undefined") {
                    const parts = (at).split(":");
                    const hours = (parseInt(parts[0]))
                    const minutes = (parseInt(parts[1]))
                    setEventRelativeDate(
                        selectedActivity as ActivityEvent,
                        selectedCourse.event,
                        courseDateInformation.getter,
                        COURSE_DATE_TO_GETTER[courseDateRef === "" ? DSLDateRef.Start : courseDateRef as DSLDateRef],
                        courseDateRef === "" ?  undefined : courseDateRef as DSLDateRef,
                        isOffsetActivated ? offsetValue! : 0,
                        offsetUnit === "" ? undefined : offsetUnit as DSLTimeUnit,
                        isAtActivated && !isNaN(minutes) ? minutes : undefined,
                        isAtActivated && !isNaN(hours)  ? hours : undefined,
                        courseDateInformation.dslIndex
                    );
                    onChange();
                }
            }
        } else {
            setIsFirstRender(false);
        }
    },
        [selectedCourseUID, courseDateRef, offsetUnit, offsetValue, isOffsetActivated, offsetValue, offsetUnit, at]
    )

    const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setOffsetValue(isNaN(val) ? undefined : val);
    };

    const handleOffsetUnitChange = (value: string) => {
        setOffsetUnit(value)
    };

    const handleCourseDateRefChange = (value: string) => {
        setCourseDateRef(value)
    };

    const handleOffsetCheckChange = (e: CheckboxChangeEvent) => {
        setIsOffsetActivated(e.target.checked);
    }

    const handleAtCheckboxChange = (e: CheckboxChangeEvent) => {
        setIsAtActivated(e.target.checked);
    }

    const handleCourseChange = (value: string) => {
        setSelectedCourseUID(value);
    }

    const handleAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAt(e.target.value)
    }



    return (
        <div className={styles.detail}>
            <h3 className={UI.h3}> {courseDateInformation.label} </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap:'20px'}}>
            <Select
                disabled={isAllDisabled}
                defaultValue={selectedCourseUID}
                onChange={handleCourseChange}>
                <Option key="" value="">Sélectionner un cours</Option>
                {courseWithNames.map((eventWithName: EventWithName) => (
                    <Option key={eventWithName.event.uid} value={eventWithName.event.uid}>
                        {eventWithName.name}
                    </Option>
                ))}
            </Select>
            
            <Select
                disabled={isAllDisabled}
                value={courseDateRef}
                onChange={handleCourseDateRefChange}>
                <Option key="" value="">Début / Fin </Option>
                {Object.keys(COURSE_DATE_TO_GETTER).map((courseRef: string) => (
                    <Option key={courseRef} value={courseRef}>
                        {DATE_REF_TO_LABEL[courseRef as DSLDateRef]}
                    </Option>
                ))}
            </Select>
            
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap:'20px' }}>
            <h3 className={UI.h4}>Décalage: </h3>

            <Checkbox disabled={isAllDisabled} checked={isOffsetActivated}
                   onChange={handleOffsetCheckChange}/>
            <Input  size="small" disabled={!isOffsetActivated || isAllDisabled}
                   type="number"
                   defaultValue={offsetValue}
                   onBlur={handleOffsetChange}
                   style={{ width: '10%' }}
                   />
           <Select
                    disabled={!isOffsetActivated || isAllDisabled}
                    value={offsetUnit}
                    onChange={handleOffsetUnitChange}
                    style={{ width: '15%' }}
                    >
                    <Option key="" value="">Unité</Option>
                    {Object.entries(DSL_TIME_UNIT_TO_LABEL).map(([unit, value]) => (
                        <Option key={unit} value={unit}>
                            {value}
                        </Option>
                    ))}
                </Select>

                <h3 className={UI.h4}> Heure: </h3>
            
                <Checkbox disabled={isAllDisabled} type="checkbox" checked={isAtActivated}
                    onChange={handleAtCheckboxChange}/>
                    
                <Input size="small"
                    disabled={!isAtActivated || isAllDisabled}
                    type="time"
                    value={at}
                    onChange={handleAtChange}
                    style={{ width: '15%' }}
                    />
                   
                <p className={styles.error}>{errorMsg}</p>
            </div>
        </div>
    );
};

export default ActivityDetail;

