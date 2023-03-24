import React, {useContext, useEffect, useState} from "react";
import ColourPicker from "@/components/view/colour/ColourPicker";
import {EventType} from "@/components/model/interfaces/courseEvent";
import {EventModelContext} from "@/components/model/EventModel";
import {EventControllerContext} from "@/components/controller/eventController";
import {eventTypeToLabel} from "@/components/model/ressource/eventRessource";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";


const CalLegend: React.FC = () => {

    const {notifyEventColourUpdate} = useContext(EventControllerContext);
    const {eventTypeColour} = useContext(EventModelContext);

    return (
        <div>
            {getKeysAsType<EventType>(eventTypeColour).map((type: EventType)=> (
                <ColourPicker key = {type.toString()}
                              type ={type}
                              label={eventTypeToLabel[type]}
                              colour={eventTypeColour[type]}
                              notifyChange={notifyEventColourUpdate} />
            ))}
        </div>
    );
};
export default CalLegend