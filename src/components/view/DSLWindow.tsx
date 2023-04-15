import React, {useContext, useEffect, useState} from 'react'
import TextEntry from "@/components/view/TextEntry";
import {EventControllerContext} from "@/components/controller/eventController";
import {EventModelContext} from "@/components/model/EventModel";
import {getTitleAsComment, hasDSL} from "@/components/controller/util/dsl/dslOperations";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";
import UI from "@/styles/CoursePlanner.module.css";
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
            <h3 className={UI.h3}>DSL : Veuillez entrer votre text</h3>
            <TextEntry text={inputDSL} onChange={setInputDSL} onSubmit={notifySubmitDSL} />
            <br></br>
            <h3 className={UI.h3}> Configuration courante du DSL  </h3>
            <pre className={UI.textInsideConfiguration}>
                {currentDSL}
            </pre>
        </div>
    );
}
export default DSLWindow