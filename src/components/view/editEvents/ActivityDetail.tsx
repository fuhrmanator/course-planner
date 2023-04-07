import { CourseEvent, EventDate } from "@/components/model/interfaces/courseEvent";
import { DSLTimeUnit } from "@/components/model/interfaces/dsl";
import { DSL_TIME_UNIT_TO_LABEL, DSL_TIME_UNIT_TO_MS } from "@/components/model/ressource/dslRessource";
import { useState,ChangeEvent } from "react";
import styles from "@/components/view/style/ShowEventsByType.module.css";

type ActivityDetailProps = {
  selectedActivity: { title: string };
  selectedCourse: CourseEvent | undefined;
  selectedStartOrEnd: EventDate | undefined;
  selectedTime: number | undefined;
  timeInput: string;
  formattedCourseEvents: CourseEvent[];
  handleEventChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleStartOrEndChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleTimeInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onTimeInputChange: (value: string) => void;
  onSelectedCourseChange: (course: CourseEvent | undefined) => void;
  onSelectedStartOrEndChange: (startOrEnd: EventDate | undefined) => void;
  onSelectedTimeChange: (time: number | undefined) => void;
  
  
};
const ActivityDetail: React.FC<ActivityDetailProps> = ({
  selectedActivity,
  selectedCourse,
  selectedStartOrEnd,
  selectedTime,
  timeInput,
  formattedCourseEvents,
  handleEventChange,
  handleStartOrEndChange,
  handleTimeInputChange,
  handleTimeChange,
  onTimeInputChange,
  onSelectedCourseChange,
  onSelectedStartOrEndChange,
  onSelectedTimeChange,
}) => {
  const [localSelectedCourse, setLocalSelectedCourse] = useState<CourseEvent | undefined>(selectedCourse);
  const [localSelectedStartOrEnd, setLocalSelectedStartOrEnd] = useState<EventDate | undefined>(selectedStartOrEnd);
  const [localSelectedTime, setLocalSelectedTime] = useState<number | undefined>(selectedTime);
  const [localTimeInput, setLocalTimeInput] = useState<string>(timeInput);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTimeInput(value);
    onTimeInputChange(value);
  };

  const handleLocalStartOrEndChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log("handleLocalStartOrEndChange called"); // add this line
    const value = e.target.value as EventDate;
    setLocalSelectedStartOrEnd(value);
    console.log("ActivityDetail localSelectedStartOrEnd:", value);
    onSelectedStartOrEndChange(value);
};


  const getKeyByValue = (object: any, value: any) => {
    return Object.keys(object).find(key => object[key] === value);
  };

  if (!selectedActivity) return null;

  return (
    <div className={styles.col}>
      <h2>{selectedActivity.title}</h2>
      <select
        value={localSelectedCourse?.uid ?? ""}
        onChange={(e) => {
          setLocalSelectedCourse(
            formattedCourseEvents.find((event) => event.uid === e.target.value)
          );
          handleEventChange(e);
        }}
      >
        <option value="">Select event</option>
        {formattedCourseEvents.map((event) => (
          <option key={event.uid} value={event.uid}>
            {event.title + event.start}
          </option>
        ))}
      </select>
      <select
      value={localSelectedStartOrEnd ?? ''}
      onChange={handleLocalStartOrEndChange}
      
    >
      
      <option value="">Début ou Fin</option>
      <option value={EventDate.Start}>Début</option>
      <option value={EventDate.End}>Fin</option>
    </select>
      
      <input
        type="text"
        value={localTimeInput}
        onChange={handleInputChange}
      />

<select value={getKeyByValue(DSL_TIME_UNIT_TO_MS, localSelectedTime) ?? ''} onChange={(e) => {
  const unit = e.target.value as DSLTimeUnit;
  setLocalSelectedTime(DSL_TIME_UNIT_TO_MS[unit]);
  onSelectedTimeChange(DSL_TIME_UNIT_TO_MS[unit]);
}}>
  <option value="">Select time</option>
  {Object.entries(DSL_TIME_UNIT_TO_LABEL).map(([unit, value]) => (
    <option key={unit} value={unit}>{value}</option>
  ))}
</select>

    </div>
  );
};

export default ActivityDetail;
