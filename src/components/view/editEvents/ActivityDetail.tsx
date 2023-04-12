import { ActivityEvent, CoursEventDateGetter as CourseEventDateGetter, CourseEvent, EventType, ActivityDateProp } from "@/components/model/interfaces/courseEvent";
import { DSLDateRef, DSLTimeUnit } from "@/components/model/interfaces/dsl";
import { DSL_TIME_UNIT_TO_LABEL } from "@/components/model/ressource/dslRessource";
import React, {useState, ChangeEvent, useEffect, useContext} from "react";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import { EventControllerContext } from "@/components/controller/eventController";
import { COURSE_DATE_TO_GETTER } from "@/components/model/ressource/eventRessource";

type ActivityDetailProps = {
  selectedActivity: CourseEvent;
  courseNameToEvent: {[key: string]:CourseEvent};
  courseDateInformation: ActivityDateProp;
};

const ActivityDetail: React.FC<ActivityDetailProps> = ({
  selectedActivity,
  courseNameToEvent,
  courseDateInformation
}) => {

  const {
    setEventRelativeDate
} = useContext(EventControllerContext);

  const [selectedCourseName, setSelectedCourseName] = useState<string>("");
  const [courseDateRef, setCourseDateRef] = useState<string>("");
  const [isOffsetActivated, setIsOffsetActivated] = useState<boolean>(false);
  const [offsetUnit, setOffsetUnit] = useState<string>("");
  const [offsetValue, setOffsetValue] = useState<number>(0);
  

  const validateInput = (): boolean => {
    return (isOffsetActivated && selectedCourseName !== "" && offsetUnit !== ""  && courseDateRef !== "") || (!isOffsetActivated && selectedCourseName !== "" && courseDateRef !== "");
  }

  useEffect(()=> {
    if (validateInput()) {
      setEventRelativeDate(
          selectedActivity as ActivityEvent,
          courseNameToEvent[selectedCourseName!],
          courseDateInformation.getter,
          COURSE_DATE_TO_GETTER[courseDateRef as DSLDateRef],
          courseDateRef as DSLDateRef,
          offsetValue,
          offsetUnit as DSLTimeUnit,
          courseDateInformation.dslIndex
      ); 
    }
  }, [selectedCourseName, offsetUnit, offsetValue])

  const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOffsetValue(parseInt(e.target.value));
  };

  const handleOffsetUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOffsetUnit(e.target.value)
  };

  const handleCourseDateRefChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCourseDateRef(e.target.value)
  };

  const getKeyByValue = (object: any, value: any) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  const handleCheckboxChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      setIsOffsetActivated(e.target.checked);
  }

  const handleCourseChange= (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseName(e.target.value);
}
  return (
    <div className={styles.detail}>
      <select
        value={selectedCourseName}
        onChange={handleCourseChange}
      >
        <option value="">Select event</option>
        {Object.keys(courseNameToEvent).map((courseName:string) => (
          <option value={courseName} />
        ))}
      </select>
      <select
        value={courseDateRef}
        onChange={handleCourseDateRefChange}
      >
        <option value="">Select course date ref.</option>
        {Object.keys(COURSE_DATE_TO_GETTER).map((courseRef:string) => (
          <option value={courseRef} />
        ))}
      </select>
      <input type="checkbox" checked={isOffsetActivated} onChange={handleCheckboxChange}/>
      <h3 className={styles.font}>Décalage: </h3>
      <input disabled={!isOffsetActivated}
          type="number"
          value={offsetValue}
          onChange={handleOffsetChange}
      />
      <select
        disabled={!isOffsetActivated}
        value={offsetUnit}
        onChange={handleOffsetUnitChange}>
          <option value="">Select time</option>
          {Object.entries(DSL_TIME_UNIT_TO_LABEL).map(([unit, value]) => (
            <option key={unit} value={unit}>
              {value}
            </option>
          ))}
      </select>
    </div>
  );
};

export default ActivityDetail;

