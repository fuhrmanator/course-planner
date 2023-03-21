import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
interface CancelChangesButtonProps {}

const CancelChangesButton: React.FC<CancelChangesButtonProps> = () => {
    const {notifyCancelChanges} = useContext(EventControllerContext);

    return (
        <button onClick={notifyCancelChanges}>
            Cancel
        </button>
    );
};

export default CancelChangesButton;
