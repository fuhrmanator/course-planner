import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";

interface SaveAllChangesButtonProps {}

const SaveAllChangesButton: React.FC<SaveAllChangesButtonProps> = () => {
    const {notifySaveChanges} = useContext(EventControllerContext);
    const handleClick = ():void => {
        notifySaveChanges(undefined);
    }
    return (
        <button onClick={handleClick}>
            Save
        </button>
    );
};

export default SaveAllChangesButton;
