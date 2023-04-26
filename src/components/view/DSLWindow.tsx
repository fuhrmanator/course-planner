import React, {useContext, useEffect, useState} from 'react'
import TextEntry from "@/components/view/TextEntry";
import {EventControllerContext} from "@/components/controller/EventController";
import {EventModelContext} from "@/components/model/EventModel";
import {makeComment, unifyDSL, validateDSL} from "@/components/controller/util/dsl/dslOperations";
import {getUnsavedStates, hasDSL} from "@/components/controller/util/eventsOperations";
import UI from "@/styles/CoursePlanner.module.css";
import ConfigurationTextEntry from './ConfigurationTextEntry';
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
                newInputDSL = newInputDSL.concat(makeComment(event.title), "\n")
                try {
                    validateDSL(event.dsl);
                } catch (e: any) {
                    if (typeof e.message !== "undefined") {
                        newInputDSL = newInputDSL.concat(makeComment(`AVERTISSEMENT ${e.message}`), "\n")
                    }
                }
                newInputDSL = newInputDSL.concat(unifyDSL(event.dsl) , "\n");
            }
        }
        setCurrentDSL(newInputDSL);
    }, [events])

    return (
        <div className={UI.flexWrapperDSLView}>
            <h3 className={UI.h3}>DSL : Veuillez entrer votre planification</h3>
            <TextEntry text={inputDSL} onChange={setInputDSL} onSubmit={notifySubmitDSL} />
            <br></br>
            <h3 className={UI.h3}> Configuration courante du DSL  </h3>
            <ConfigurationTextEntry text={currentDSL}  />
        </div>
    );
}
export default DSLWindow