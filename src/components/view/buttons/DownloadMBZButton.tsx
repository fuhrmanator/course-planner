import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from '@/styles/CoursePlanner.module.css';
import {EventModelContext} from "@/components/model/EventModel";
import classNames from "classnames";

const DownloadMBZButton: React.FC<{}> = () => {
    const [downloadLink, setDownloadLink] = useState<string>("");
    const {notifyMBZDownload} = useContext(EventControllerContext);
    const {mbzData} = useContext(EventModelContext);
    const [isDisabled, setIsDisabled] = useState<boolean>(!mbzData.hasData())

    const handleOnClick = () => {
        if (!isDisabled) {
            const downloadURL = notifyMBZDownload(downloadLink);
            setDownloadLink(downloadURL);
        } else {
            setDownloadLink("");
        }
    }

    useEffect(()=> {
        setIsDisabled(!mbzData.hasData())
    }, [mbzData])

    const visibilityClass = classNames({
        [UI.hidden]: isDisabled,
        [UI.overlay]: !isDisabled,
    });

    return (
        
        <a  onClick={handleOnClick} download="moodle_course.zip" href={downloadLink} >
            <button disabled={isDisabled} className={`${UI.button} ${visibilityClass}`}>
                <div className={UI.uiLabel}>
                    Exporter
                </div>
            </button>
        </a>
        
    );
};

export default DownloadMBZButton;
