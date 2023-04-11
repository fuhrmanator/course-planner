import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';
import {EventModelContext} from "@/components/model/EventModel";

interface SuggestionButtonProps {}

const SuggestionButton: React.FC<SuggestionButtonProps> = () => {
    const {notifySuggestion} = useContext(EventControllerContext);
    const {activityEvents, oldCourseEvents, newCourseEvents} = useContext(EventModelContext);
    const isDisabled = (): boolean => {
        return activityEvents.length <= 0 || oldCourseEvents.length <= 0 || newCourseEvents.length <= 0;
    }
    return (

        <button disabled={isDisabled()} onClick={notifySuggestion} className={UI.button}>
            <div className={UI.uiLabel}>
            Afficher les suggestions
            </div>
        </button>
    );
};

export default SuggestionButton;
