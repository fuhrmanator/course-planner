import React, {useContext} from "react";
import {EventModelContext} from "@/components/model/EventModel";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";
import {ActivityType, CourseType} from "@/components/model/interfaces/courseEvent";
import {COURSE_TYPE_TO_LABEL, EVENT_TYPE_TO_LABEL} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/EventController";
import SuggestionButton from "../buttons/SuggestionButton";
import UI from '@/styles/CoursePlanner.module.css'

interface SuggestionConfigItemProps {
    type: ActivityType,
    value: CourseType,
    onChange: (type:ActivityType, value:string) => void
}

const SuggestionConfigItem: React.FC<SuggestionConfigItemProps> = ({type, value, onChange}) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(type, event.target.value);
    };

    return (
        <select value={value} onChange={handleChange}>
            {getKeysAsType<CourseType>(COURSE_TYPE_TO_LABEL).map((courseType) => (
                <option key={courseType} value={courseType}>{COURSE_TYPE_TO_LABEL[courseType]}</option>
            ))}
        </select>
    );
};

interface DropdownProps {
}
const SuggestionConfig: React.FC<DropdownProps> = () => {
    const {suggestionConfig} = useContext(EventModelContext)
    const {notifySuggestionConfigUpdate} = useContext(EventControllerContext)
    const handleChange = (type:ActivityType, value:string) => {
        notifySuggestionConfigUpdate(type, parseInt(value) as CourseType); // will always be of CourseType
    };

    return (
        <div>
            {getKeysAsType<ActivityType>(suggestionConfig).map((activityType) => (
                <div key={activityType}>
                    <label>{EVENT_TYPE_TO_LABEL[activityType]}</label>
                    <SuggestionConfigItem type={activityType} value={suggestionConfig[activityType]} onChange={handleChange} />
                </div>
            ))}
             
        </div>
    );
};

export default SuggestionConfig