import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';
import {CourseInformationContext} from "@/components/view/CourseInformationForm";

interface SubmitCourseButtonProps {}

const SubmitCourseButton: React.FC<SubmitCourseButtonProps> = () => {
    const {handleSubmit, isFormValid} = useContext(CourseInformationContext);

    return (

        <button disabled={!isFormValid} onClick={handleSubmit} className={UI.button}>
            <div className={UI.uiLabel}>
            Submit
            </div>
        </button>
    );
};

export default SubmitCourseButton;
