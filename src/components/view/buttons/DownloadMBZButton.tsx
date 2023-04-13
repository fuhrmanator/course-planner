import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';
import {EventModelContext} from "@/components/model/EventModel";

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


    return (
        <div className={UI.flexWrapperButton}>
        <a  onClick={handleOnClick} download="moodle_course.zip" href={downloadLink} >
            <button disabled={isDisabled} className={UI.button}>
                <div className={UI.uiLabel}>
                    Exporter
                </div>
            </button>
        </a>
        </div>
    );
};

export default DownloadMBZButton;
