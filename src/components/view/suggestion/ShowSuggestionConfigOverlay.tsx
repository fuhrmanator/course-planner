import React, {MouseEventHandler, useState} from "react";
import SuggestionConfig from "@/components/view/suggestion/SuggestionConfig";
import styles from "@/components/view/style/ShowSuggestionConfigOverlay.module.css"
import classNames from "classnames";
const ShowSuggestionConfigOverlay: React.FC = () => {
    const [showOverlay, setShowOverlay] = useState(false);
    const visibilityClass = classNames({
        [styles.hidden]: !showOverlay,
        [styles.overlay]: showOverlay,
    });
    const handleAnchorClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
        event.preventDefault();
        setShowOverlay(true);
    };

    const handleCloseClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setShowOverlay(false);
    };

    return (
        <div>
            <a onClick={handleAnchorClick}>
                Configurer la suggestion
            </a>
            <div className={visibilityClass}>
                <SuggestionConfig />
                <button onClick={handleCloseClick} >Fermer</button>
            </div>

        </div>
    );
};

export default ShowSuggestionConfigOverlay;