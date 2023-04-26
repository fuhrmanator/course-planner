import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from '@/styles/CoursePlanner.module.css';
import {EventModelContext} from "@/components/model/EventModel";
import classNames from "classnames";
import {getValue, setValue} from "@/components/model/localStore";
import {
    CODE_STORE_KEY,
    GROUP_STORE_KEY,
    SESSION_STORE_KEY,
    YEAR_STORE_KEY
} from "@/components/view/CourseInformationForm";

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

    const getSuffixPart = (key:string, prefix:string): string => {
        let val = getValue(key, "[]");
        if (val.length != 0) {
            val = `_${prefix}${val}`
        }
        return val;
    }

    const getDownloadName = (): string => {
        return `moodle_backup${getSuffixPart(CODE_STORE_KEY, "")}${getSuffixPart(YEAR_STORE_KEY, "y")}${getSuffixPart(SESSION_STORE_KEY, "s")}${getSuffixPart(GROUP_STORE_KEY, "g")}.zip`
    }

    useEffect(()=> {
        setIsDisabled(!mbzData.hasData())
    }, [mbzData])

    const visibilityClass = classNames({
        [UI.hidden]: isDisabled,
        [UI.overlay]: !isDisabled,
    });

    return (
        
        <a  onClick={handleOnClick} download={getDownloadName()} href={downloadLink} >
            <button disabled={isDisabled} className={`${UI.button} ${visibilityClass}`}>
                <div className={UI.uiLabel}>
                    Exporter
                </div>
            </button>
        </a>
        
    );
};

export default DownloadMBZButton;
