import React, {useContext, useState} from "react";
import {EventModelContext} from "@/components/model/EventModel";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";
import {ActivityType, CourseEvent, CourseType} from "@/components/model/interfaces/courseEvent";
import {courseTypeToLabel, eventTypeToLabel} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/eventController";
import RadioButton from "@/components/view/RadioButton";
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
    const handleTypeChange = (type:ActivityType, value:string) => {
        suggestionConfig.typeMap[type] = parseInt(value) as CourseType;
        notifySuggestionConfigUpdate(suggestionConfig); // will always be of CourseType
    };

    const handleBoolChange = (newBool: boolean) => {
        suggestionConfig.useAbsoluteTime = newBool
        notifySuggestionConfigUpdate(suggestionConfig); // will always be of CourseType
    };

    return (
        <div>
            {getKeysAsType<ActivityType>(suggestionConfig.typeMap).map((activityType) => (
                <div key={activityType}>
                    <label>{eventTypeToLabel[activityType]}</label>
                    <SuggestionConfigItem type={activityType} value={suggestionConfig.typeMap[activityType]} onChange={handleTypeChange} />
                </div>
            ))}
            <RadioButton labelTrue={"Durée absolue"} labelFalse={"Durée relative"} value={suggestionConfig.useAbsoluteTime} onChange={handleBoolChange} />
        </div>
    );
};

export default SuggestionConfig