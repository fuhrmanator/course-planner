import React, {useContext, useState} from "react";
import {EventControllerContext} from "@/components/controller/eventController";
import UI from '@/styles/CoursePlanner.module.css';

const DownloadMBZButton: React.FC<{}> = () => {
    const [downloadLink, setDownloadLink] = useState<string>("");
    const {notifyMBZDownload} = useContext(EventControllerContext);

    const handleOnClick = () => {
        const downloadURL = notifyMBZDownload(downloadLink);
        setDownloadLink(downloadURL);
    }
    


    return (

        <a  onClick={handleOnClick} download="moodle_course.zip" href={downloadLink} >
            <button className={UI.button}>
                <div className={UI.uiLabel}>
                    Exporter
                </div>
            </button>
        </a>

    );
};

export default DownloadMBZButton;
