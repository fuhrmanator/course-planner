import React, {useContext, useEffect, useState} from "react";
import ColourPicker from "@/components/view/colourPicker";
import {CalEventTypeColour, CalEventType} from "@/components/model/interfaces/events/calEvent";
import {EventModelContext} from "@/components/model/eventModel";
import {EventControllerContext} from "@/components/controller/eventController";
import {eventTypeToLabel} from "@/components/model/ressource/eventRessource";


const CalLegend: React.FC = () => {

    const {notifyEventColourUpdated} = useContext(EventControllerContext);
    const {eventTypeColour} = useContext(EventModelContext);

    return (
        <div>
            {eventTypeColour.map((event: CalEventTypeColour)=> (
                <ColourPicker key = {event.type.toString()}
                              id ={event.type}
                              label={eventTypeToLabel[event.type]||"Type invalide"}
                              colour={event.colour}
                              notifyChange={notifyEventColourUpdated} />
            ))}
        </div>
    );
};
export default CalLegend