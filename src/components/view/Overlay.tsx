import React, {MouseEventHandler, useEffect, useState} from "react";
import styles from "@/components/view/style/ShowOverlay.module.css"
import classNames from "classnames";
import UI from '@/styles/CoursePlanner.module.css'


type ShowOverlayProps = {
    children: React.ReactNode;
    isVisible: boolean;
    visibilityCallback: (isVisible:boolean) => void;
}
const Overlay: React.FC<ShowOverlayProps> = ({children, isVisible, visibilityCallback}) => {
    const [isVisibleLocal, setIsVisibleLocal] = useState<boolean>(isVisible);

    const visibilityClass = classNames({
        [styles.hidden]: !isVisibleLocal,
        [styles.overlay]: isVisibleLocal,
    });

    useEffect(()=> {
        setIsVisibleLocal(isVisible)
    }, [isVisible])
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsVisibleLocal(false);
        }
    };

    const handleCloseClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        setIsVisibleLocal(false);
    };

    useEffect(()=> {
        if (!isVisibleLocal) {
            visibilityCallback(false);
            document.removeEventListener("keydown", handleKeyPress);
        } else {
            document.addEventListener("keydown", handleKeyPress);
        }
    }, [isVisibleLocal])

    useEffect(() => {
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    return (
        <div className={visibilityClass}>
            <div className={styles.popup}>
                {children}   
            </div>
        </div>
    );
};

export default Overlay;