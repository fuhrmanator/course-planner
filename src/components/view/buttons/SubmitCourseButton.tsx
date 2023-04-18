import React, {useContext} from "react";
import UI from '@/styles/CoursePlanner.module.css';
import {CourseInformationContext} from "@/components/view/CourseInformationForm";
import classNames from "classnames";

interface SubmitCourseButtonProps {
    submitCallback?: () => void;
}

const SubmitCourseButton: React.FC<SubmitCourseButtonProps> = ({submitCallback}) => {
    const {handleSubmit, isFormValid} = useContext(CourseInformationContext);

    const handleClick = () => {
        if (typeof submitCallback !== "undefined") {
            submitCallback();
        }
        handleSubmit();
    }

    const visibilityClass = classNames({
        [UI.hidden]: !isFormValid,
        [UI.overlay]: isFormValid,
    });

    return (
        <button disabled={!isFormValid} onClick={handleClick} className={`${UI.button} ${visibilityClass}`}>
            <div className={UI.uiLabel}>
                Envoyer
            </div>
        </button>
        );
};

export default SubmitCourseButton;
