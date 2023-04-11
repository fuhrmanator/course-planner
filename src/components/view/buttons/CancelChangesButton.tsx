import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";
import {EventModelContext} from "@/components/model/EventModel";
interface CancelChangesButtonProps {}
/**

 Represents a button component that cancels changes made to all events.
 This component uses the EventControllerContext to access the notifyCancelChanges function, which cancels any changes made to an event.
 @component
 */
const CancelChangesButton: React.FC<CancelChangesButtonProps> = () => {
    const {notifyCancelChanges} = useContext(EventControllerContext);
    const {events} = useContext(EventModelContext);
    const handleClick = ():void => {
        notifyCancelChanges(undefined);
    }
    const isDisable = ():boolean => {
        return getUnsavedStates(events).length <= 0
    }

    return (
        <button disabled={isDisable()} onClick={handleClick} className={UI.button}>
            <div className={UI.uiLabel}>
                Annuler les modifications
            </div>
        </button>
    );
};

export default CancelChangesButton;
