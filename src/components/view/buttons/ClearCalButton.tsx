import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from "@/styles/CoursePlanner.module.css";

interface ClearCalProps {}

const ClearCalButton: React.FC<ClearCalProps> = () => {
    const {notifyClearCal} = useContext(EventControllerContext); 
    
    return (
        
        <button onClick={notifyClearCal} className={UI.button}>
            <div className={UI.uiLabel}>
                Effacer le calendrier
            </div>
        </button>
        
    );
};

export default ClearCalButton;
