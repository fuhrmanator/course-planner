import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";
interface CancelChangesButtonProps {}
/**

 Represents a button component that cancels changes made to all events.
 This component uses the EventControllerContext to access the notifyCancelChanges function, which cancels any changes made to an event.
 @component
 */
const CancelChangesButton: React.FC<CancelChangesButtonProps> = () => {
    const {notifyCancelChanges} = useContext(EventControllerContext);
    const handleClick = ():void => {
        notifyCancelChanges(undefined);
    }
    return (
        <button onClick={handleClick} className={UI.button}>
            <div className={UI.uiLabel}>
                Annuler les modifications
            </div>
        </button>
    );
};

export default CancelChangesButton;
