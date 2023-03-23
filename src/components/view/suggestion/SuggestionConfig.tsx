import React, {useContext, useState} from "react";
import {EventModelContext} from "@/components/model/EventModel";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";
import {ActivityType, CourseEvent, CourseType} from "@/components/model/interfaces/courseEvent";
import {courseTypeToLabel, eventTypeToLabel} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/eventController";
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
            {getKeysAsType<CourseType>(courseTypeToLabel).map((courseType) => (
                <option key={courseType} value={courseType}>{courseTypeToLabel[courseType]}</option>
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
                    <label>{eventTypeToLabel[activityType]}</label>
                    <SuggestionConfigItem type={activityType} value={suggestionConfig[activityType]} onChange={handleChange} />
                </div>
            ))}
        </div>
    );
};

export default SuggestionConfig