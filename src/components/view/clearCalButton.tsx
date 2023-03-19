import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";

interface ClearCalProps {}

const ClearCalButton: React.FC<ClearCalProps> = () => {
    const {notifyClearCal} = useContext(EventControllerContext); 
    
    return (
        <button onClick={notifyClearCal}>
        Supprimer
        </button>
    );
};

export default ClearCalButton;
