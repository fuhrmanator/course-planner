import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";
import {EventModelContext} from "@/components/model/EventModel";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";

interface SaveAllChangesButtonProps {}

const SaveAllChangesButton: React.FC<SaveAllChangesButtonProps> = () => {
    const {notifySaveChanges} = useContext(EventControllerContext);
    const {events} = useContext(EventModelContext);
    const handleClick = ():void => {
        notifySaveChanges(undefined);
    }

    const isDisable = ():boolean => {
        return getUnsavedStates(events).length <= 0
    }

    return (
        <button disabled={isDisable()} onClick={handleClick} className={UI.button}>
            <div className={UI.uiLabel}>
                Sauvegarder les suggestions
            </div>
        </button>
    );
};

export default SaveAllChangesButton;
