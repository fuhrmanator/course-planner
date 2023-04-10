import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';

interface SuggestionButtonProps {}

const SuggestionButton: React.FC<SuggestionButtonProps> = () => {
    const {notifySuggestion} = useContext(EventControllerContext);

    return (

        <button onClick={notifySuggestion} className={UI.button}>
            <div className={UI.uiLabel}>
            Afficher les suggestions
            </div>
        </button>
    );
};

export default SuggestionButton;
