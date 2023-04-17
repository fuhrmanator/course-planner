import React, {useContext, useState} from "react";
import {EventModelContext} from "@/components/model/EventModel";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";
import {ActivityType, CourseType} from "@/components/model/interfaces/courseEvent";
import {COURSE_TYPE_TO_LABEL, EVENT_TYPE_TO_LABEL} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/EventController";


interface SuggestionConfigItemProps {
    type: ActivityType,
    value: CourseType[],
    onChange: (type:ActivityType, value:CourseType[]) => void
}

const SuggestionConfigItem: React.FC<SuggestionConfigItemProps> = ({type, value, onChange}) => {
    const handleItemChecked = (courseType: CourseType) => {
        if (courseType in value) {
            onChange(type, value.filter((courseTypeItem) => courseTypeItem !== courseType));
        } else {
            onChange(type, [...value, courseType]);
        }
    }

    const isChecked  = (courseType: CourseType) => {
        return typeof value.find(courseTypeItem => courseTypeItem === courseType) !== 'undefined';
    }

    return (
        <div>
            {getKeysAsType<CourseType>(COURSE_TYPE_TO_LABEL).map((courseType: CourseType) => (
                <label>{COURSE_TYPE_TO_LABEL[courseType]}
                    <input type="checkbox" checked={isChecked(courseType)} onChange={() => handleItemChecked(courseType)}/>
                </label>
            ))}

        </div>
    );
};

interface DropdownProps {
}
const SuggestionConfig: React.FC<DropdownProps> = () => {
    const {suggestionConfig} = useContext(EventModelContext)
    const {notifySuggestionConfigUpdate} = useContext(EventControllerContext)
    const handleChange = (type:ActivityType, value:CourseType[]) => {
        notifySuggestionConfigUpdate(type, value);
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