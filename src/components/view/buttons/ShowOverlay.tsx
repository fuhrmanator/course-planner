import React, {MouseEventHandler, useState} from "react";
import UI from '@/styles/CoursePlanner.module.css'
import Overlay from "@/components/view/Overlay";

type ShowOverlayProps = {
    children: React.ReactNode;
    label: string;
}
const ShowOverlay: React.FC<ShowOverlayProps> = ({children, label}) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const handleAnchorClick: MouseEventHandler<HTMLAnchorElement> = (event) => {

        event.preventDefault();
        setShowOverlay(true);
    };

    return (
        <div>
            <a onClick={handleAnchorClick} className={UI.button}>
                <div className={UI.uiLabel}>
                {label}
                </div>
            </a>
            <Overlay isVisible={showOverlay} visibilityCallback={setShowOverlay}>
                    {children}
            </Overlay>
        </div>
    );
};

export default ShowOverlay;