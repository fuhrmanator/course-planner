import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";

interface SaveAllChangesButtonProps {}

const SaveAllChangesButton: React.FC<SaveAllChangesButtonProps> = () => {
    const {notifySaveChanges} = useContext(EventControllerContext);
    const handleClick = ():void => {
        notifySaveChanges(undefined);
    }
    return (
        <button onClick={handleClick} className={UI.button}>
            <div className={UI.uiLabel}>
                Sauvegarder
            </div>
        </button>
    );
};

export default SaveAllChangesButton;
