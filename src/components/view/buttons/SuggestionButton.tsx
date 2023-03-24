import React, {useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";

interface SuggestionButtonProps {}

const SuggestionButton: React.FC<SuggestionButtonProps> = () => {
    const {notifySuggestion} = useContext(EventControllerContext);

    return (
        <button onClick={notifySuggestion}>
            Suggestion
        </button>
    );
};

export default SuggestionButton;
