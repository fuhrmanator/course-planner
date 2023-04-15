import {ActivityDateProp, ActivityEvent, CourseEvent} from "@/components/model/interfaces/courseEvent";
import {DSLDateRef, DSLTimeUnit} from "@/components/model/interfaces/dsl";
import {DATE_REF_TO_LABEL, DSL_TIME_UNIT_TO_LABEL} from "@/components/model/ressource/dslRessource";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import {EventControllerContext} from "@/components/controller/eventController";
import {COURSE_DATE_TO_GETTER} from "@/components/model/ressource/eventRessource";

import UI from '@/styles/CoursePlanner.module.css';
import { Select, Input, Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

const { Option } = Select;

type ActivityDetailProps = {
    selectedActivity: CourseEvent;
    courseNameToEvent: { [key: string]: CourseEvent };
    courseDateInformation: ActivityDateProp;
    onChange: () => void;
};

const ActivityDetail: React.FC<ActivityDetailProps> = ({
                                                           selectedActivity,
                                                           courseNameToEvent,
                                                           courseDateInformation,
                                                           onChange
                                                       }) => {
    const {setEventRelativeDate} = useContext(EventControllerContext);

    const [errorMsg, setErrorMsg] = useState<string>("");
    const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
    const [selectedCourseName, setSelectedCourseName] = useState<string>("");
    const [courseDateRef, setCourseDateRef] = useState<string>("");
    const [isOffsetActivated, setIsOffsetActivated] = useState<boolean>(false);
    const [offsetUnit, setOffsetUnit] = useState<string>("");
    const [offsetValue, setOffsetValue] = useState<number | undefined>(0);
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
                onChange();
            }
        },
        [selectedCourseName, courseDateRef, offsetUnit, offsetValue, isOffsetActivated, offsetValue, offsetUnit, atMinutes, atHours]
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
        setSelectedCourseName(value);
    }

    const handleAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parts = (e.target.value).split(":");
        setAtHours(parseInt(parts[0]))
        setAtMinutes(parseInt(parts[1]))
    }
    return (
        <div className={styles.detail}>
            <h3 className={UI.h3}> {courseDateInformation.label} </h3>
            <div style={{ display: 'flex', alignItems: 'center', }}>
            <Select
                disabled={isAllDisabled}
                value={selectedCourseName}
                onChange={handleCourseChange}>
                <Option key="" value="">Sélectionner un cours</Option>
                {Object.keys(courseNameToEvent).map((courseName: string) => (
                    <Option key={courseNameToEvent[courseName].uid} value={courseName}>
                        {courseName}
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
            <div style={{ display: 'flex', alignItems: 'center', }}>
            <h3 className={UI.h4}>Décalage: </h3>

            <Checkbox disabled={isAllDisabled} checked={isOffsetActivated}
                   onChange={handleOffsetCheckChange}/>
            <Input  size="small" disabled={!isOffsetActivated || isAllDisabled}
                   type="number"
                   defaultValue={offsetValue}
                   onChange={handleOffsetChange}
                   style={{ width: '5%' }}
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
            
            

                <h3 className={UI.h4}> Ajustement: </h3>                
            
                <Checkbox disabled={isAllDisabled} type="checkbox" checked={isAtActivated}
                    onChange={handleAtCheckboxChange}/>
                    
                <Input size="small"
                    disabled={!isAtActivated || isAllDisabled}
                    type="time"
                    defaultValue={""}
                    onChange={handleAtChange}
                    style={{ width: '15%' }}
                    />
                   
                <p className={styles.error}>{errorMsg}</p>
            </div>
        </div>
    );
};

export default ActivityDetail;

