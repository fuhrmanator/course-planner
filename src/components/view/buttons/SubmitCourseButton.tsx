import React, {useContext} from "react";
import UI from '@/styles/CoursePlanner.module.css';
import {CourseInformationContext} from "@/components/view/CourseInformationForm";

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

    return (

        <button disabled={!isFormValid} onClick={handleClick} className={UI.button}>
            <div className={UI.uiLabel}>
            Submit
            </div>
        </button>
    );
};

export default SubmitCourseButton;
