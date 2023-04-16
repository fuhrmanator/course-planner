import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from '@/styles/CoursePlanner.module.css';
import {EventModelContext} from "@/components/model/EventModel";
import classNames from "classnames";

interface SuggestionButtonProps {}

const SuggestionButton: React.FC<SuggestionButtonProps> = () => {
    const {notifySuggestion} = useContext(EventControllerContext);
    const {activityEvents, oldCourseEvents, newCourseEvents} = useContext(EventModelContext);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(()=>{
        setIsDisabled(activityEvents.length <= 0 || oldCourseEvents.length <= 0 || newCourseEvents.length <= 0)
    },[activityEvents, oldCourseEvents, newCourseEvents])

    const visibilityClass = classNames({
        [UI.hidden]: isDisabled,
        [UI.overlay]: !isDisabled,
    });
    return (

        <button disabled={isDisabled} onClick={notifySuggestion} className={visibilityClass}>
            <div className={UI.uiLabel}>
            Afficher les suggestions
            </div>
        </button>
    );
};

export default SuggestionButton;
