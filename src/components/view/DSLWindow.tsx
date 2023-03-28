import React, {useContext, useEffect, useState} from 'react'
import TextEntry from "@/components/view/TextEntry";
import {EventControllerContext} from "@/components/controller/eventController";
import {EventModelContext} from "@/components/model/EventModel";
import {getDSLWithTitle} from "@/components/controller/util/dsl/dslOperations";

interface DSLWindowProps {}

const DSLWindow: React.FC<DSLWindowProps> = ({}) => {
    const {events} = useContext(EventModelContext)
    const {notifySubmitDSL} = useContext(EventControllerContext)
    const [inputDSL, setInputDSL] = useState<string>(
        `Q1 S1F S2S-30m\nQ2 S2F S3S-1h\nQ3 S2F S3S-1d\nQ4 S2F S3S-1w\nQ6 S2F S3S-1d@23:55\nH1 L2F L3S-1d@23:55 L3S-1d@23:55`);
    const [currentDSL, setCurrentDSL] = useState<string>("");

    useEffect(()=> {
        let newInputDSL = ""
        for (const event of events) {
            let dsl = getDSLWithTitle(event);
            if (dsl !== "") {
                newInputDSL = newInputDSL.concat(getDSLWithTitle(event), "\n");
            }
        }
        setCurrentDSL(newInputDSL);
    }, [events])

    return (
        <div>
            <h3>Input</h3>
            <TextEntry text={inputDSL} onChange={setInputDSL} onSubmit={notifySubmitDSL} />
            <h3>Current DSL</h3>
            <pre style={{background:"white", width:"90%", height:"200px"}}>
                {currentDSL}
            </pre>
        </div>
    );
}
export default DSLWindow