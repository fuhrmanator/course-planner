import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";
import {EventModelContext} from "@/components/model/EventModel";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";

interface SaveAllChangesButtonProps {}

const SaveAllChangesButton: React.FC<SaveAllChangesButtonProps> = () => {
    const {notifySaveChanges} = useContext(EventControllerContext);
    const {events} = useContext(EventModelContext);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(()=>{
        setIsDisabled(getUnsavedStates(events).length <= 0)
    },[events])
    const handleClick = ():void => {
        notifySaveChanges(undefined);
    }

    return (
        <button disabled={isDisabled} onClick={handleClick} className={UI.button}>
            <div className={UI.uiLabel}>
                Sauvegarder les suggestions
            </div>
        </button>
    );
};

export default SaveAllChangesButton;
