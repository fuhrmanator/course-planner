import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from "@/styles/CoursePlanner.module.css";
import {EventModelContext} from "@/components/model/EventModel";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";
import classNames from "classnames";

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
    const visibilityClass = classNames({
        [UI.hidden]: isDisabled,
        [UI.overlay]: !isDisabled,
    });

    return (

            <button disabled={isDisabled} onClick={handleClick} className={visibilityClass}>
                <div className={UI.uiLabel}>
                    Tout sauvegarder
                </div>
            </button>

    );
};

export default SaveAllChangesButton;
