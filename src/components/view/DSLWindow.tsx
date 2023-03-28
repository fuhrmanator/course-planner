import React, {useContext, useState} from 'react'
import TextEntry from "@/components/view/TextEntry";
import {EventControllerContext} from "@/components/controller/eventController";

interface DSLWindowProps {}

const DSLWindow: React.FC<DSLWindowProps> = ({}) => {
    const {notifySubmitDSL} = useContext(EventControllerContext)
    const [dsl, setDSL] = useState<string>(
        `Q1 S1F S2S-30m\nQ2 S2F S3S-1h\nQ3 S2F S3S-1d\nQ4 S2F S3S-1w\nQ6 S2F S3S-1d@23:55\nH1 L2F L3S-1d@23:55 L3S-1d@23:55\nE1 S10`);
    return (
        <div>
            <TextEntry text={dsl} onChange={setDSL} onSubmit={notifySubmitDSL} />
        </div>
    );
}
export default DSLWindow