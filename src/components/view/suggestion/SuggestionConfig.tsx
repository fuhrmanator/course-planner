import React, {useContext, useState} from "react";
import {EventModelContext} from "@/components/model/EventModel";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";
import {ActivityType, CourseType} from "@/components/model/interfaces/courseEvent";
import {COURSE_TYPE_TO_LABEL, EVENT_TYPE_TO_LABEL} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from '@/styles/CoursePlanner.module.css'

interface SuggestionConfigItemProps {
    type: ActivityType,
    value: CourseType[],
    onChange: (type:ActivityType, value:CourseType[]) => void
}

const SuggestionConfigItem: React.FC<SuggestionConfigItemProps> = ({type, value, onChange}) => {
    const handleItemChecked = (courseType: CourseType) => {
        if (value.includes(courseType)) {
            onChange(type, value.filter((courseTypeItem) => courseTypeItem !== courseType));
        } else {
            onChange(type, [...value, courseType]);
        }
    }

    const isChecked  = (courseType: CourseType) => {
        return value.includes(courseType)
    }

    return (
        <div>
            {getKeysAsType<CourseType>(COURSE_TYPE_TO_LABEL).map((courseType: CourseType) => (
                <label className={UI.flexWrapperSuggestionBox}>{COURSE_TYPE_TO_LABEL[courseType]}
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
        
        <div className={UI.flexWrapperAffiCoursLab}>
            {getKeysAsType<ActivityType>(suggestionConfig).map((activityType) => (
                <div key={activityType}>
                    <label className={UI.flexWrapperAffi}>{EVENT_TYPE_TO_LABEL[activityType]}</label>
                    <SuggestionConfigItem type={activityType} value={suggestionConfig[activityType]} onChange={handleChange} />
                </div>
            ))}
             
        </div>
    );
};

export default SuggestionConfig