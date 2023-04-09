import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";

interface ClearCalProps {}

const ClearCalButton: React.FC<ClearCalProps> = () => {
    const {notifyClearCal} = useContext(EventControllerContext); 
    
    return (
        <button onClick={notifyClearCal} className={UI.button}>
        Effacer le calendrier
        </button>
    );
};

export default ClearCalButton;
