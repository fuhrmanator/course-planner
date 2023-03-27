import React, {MouseEventHandler, useState} from "react";
import SuggestionConfig from "@/components/view/suggestion/SuggestionConfig";
import styles from "@/components/view/style/ShowOverlay.module.css"
import classNames from "classnames";
type ShowOverlayProps = {
    children: React.ReactNode;
    label: string;
}
const ShowOverlay: React.FC<ShowOverlayProps> = ({children, label}) => {
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
                {label}
            </a>
            <div className={visibilityClass}>
                {children}
                <button onClick={handleCloseClick} >Fermer</button>
            </div>

        </div>
    );
};

export default ShowOverlay;