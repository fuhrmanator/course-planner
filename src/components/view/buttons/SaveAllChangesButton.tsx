import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
interface SaveAllChangesButtonProps {}

const SaveAllChangesButton: React.FC<SaveAllChangesButtonProps> = () => {
    const {notifySaveAllChanges} = useContext(EventControllerContext);

    return (
        <button onClick={notifySaveAllChanges}>
            Save
        </button>
    );
};

export default SaveAllChangesButton;
