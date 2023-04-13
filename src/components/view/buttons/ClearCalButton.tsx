import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";

interface ClearCalProps {}

const ClearCalButton: React.FC<ClearCalProps> = () => {
    const {notifyClearCal} = useContext(EventControllerContext); 
    
    return (
        <div className={UI.flexWrapperButton}>
        <button onClick={notifyClearCal} className={UI.button}>
            <div className={UI.uiLabel}>
                Effacer le calendrier
            </div>
        </button>
        </div>
    );
};

export default ClearCalButton;
