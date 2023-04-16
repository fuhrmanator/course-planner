import React, { useContext } from "react";
import ColourPicker from "@/components/view/colour/ColourPicker";
import { EventType } from "@/components/model/interfaces/courseEvent";
import { EventModelContext } from "@/components/model/EventModel";
import { EventControllerContext } from "@/components/controller/EventController";
import { EVENT_TYPE_TO_LABEL } from "@/components/model/ressource/eventRessource";
import { getKeysAsType } from "@/components/controller/util/eventsOperations";
import UI from "@/styles/CoursePlanner.module.css";

const CalLegend: React.FC = () => {
  const { notifyEventColourUpdate } = useContext(EventControllerContext);
  const { eventTypeColour } = useContext(EventModelContext);

  return (
    <div className={UI.flexWrapperLegend}>
      {getKeysAsType<EventType>(eventTypeColour).map(
        (type: EventType, index: number) => (
          <React.Fragment key={type.toString()}>
            <ColourPicker
              type={type}
              label={EVENT_TYPE_TO_LABEL[type]}
              colour={eventTypeColour[type]}
              notifyChange={notifyEventColourUpdate}
              style={{ marginRight: '20px' }}
            />
          </React.Fragment>
        )
      )}
    </div>
  );
};
export default CalLegend;
