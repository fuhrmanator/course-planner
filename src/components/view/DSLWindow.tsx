import React, {useContext, useEffect, useState} from 'react'
import TextEntry from "@/components/view/TextEntry";
import {EventControllerContext} from "@/components/controller/eventController";
import {EventModelContext} from "@/components/model/EventModel";
import {getTitleAsComment, hasDSL} from "@/components/controller/util/dsl/dslOperations";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";

interface DSLWindowProps {}

const DSLWindow: React.FC<DSLWindowProps> = ({}) => {
    const {events} = useContext(EventModelContext)
    const {notifySubmitDSL} = useContext(EventControllerContext)
    const [inputDSL, setInputDSL] = useState<string>("");
    const [currentDSL, setCurrentDSL] = useState<string>("");

    useEffect(()=> {
        let newInputDSL = ""
        for (const event of getUnsavedStates(events)) {
            if (hasDSL(event)) {
                newInputDSL = newInputDSL.concat(getTitleAsComment(event), "\n", event.dsl! , "\n");
            }
        }
        setCurrentDSL(newInputDSL);
    }, [events])

    return (
        <div>
            <h3>Input</h3>
            <TextEntry text={inputDSL} onChange={setInputDSL} onSubmit={notifySubmitDSL} />
            <h3>Current DSL</h3>
            <pre style={{background:"white", width:"90%", height:"200px", overflow:"scroll"}}>
                {currentDSL}
            </pre>
        </div>
    );
}
export default DSLWindow