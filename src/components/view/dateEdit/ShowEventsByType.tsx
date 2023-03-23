import { EventModelContext } from "@/components/model/EventModel";
import { CourseEvent, ActivityType} from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import React, { useContext, useState } from "react";
import moment from "moment";
import EventItem from "@/components/view/dateEdit/EventItem";
import {getKeysAsType} from "@/components/controller/util/eventsOperations";
import {activityTypeToLabel} from "@/components/model/ressource/eventRessource";
import {EventControllerContext} from "@/components/controller/eventController";


const ShowEventsByType: React.FC = () => {
  // TODO amokrane utiliser cette fonction pour apporter des changemetns aux évènements
  // étant donné qu'elle prend un évènement relativeTo en param, tu va devoir lui passer
  // l'évènement sélectionné par le menu déroulant "évènement"
  // Pour obtenir la liste des évènements de type scéance de cours assure toi d'aller chercher la bonne
  // collection dans le contexte du model ( courseEvents )

  const { notifyRelativeChange } = useContext(EventControllerContext);
  const { activityEvents } = useContext(EventModelContext);

  const [isDetailsVisible, setIsDetailsVisible] = useState<{ [key: string]: boolean }>({});

  const toggleDetailsVisibility = (eventId: string) => {
    setIsDetailsVisible(prevState => ({
      ...prevState,
      [eventId]: !prevState[eventId],
    }));
  };

  const renderEvent = (event: CourseEvent) => {
    const { uid, title, start, end } = event;

    return (
      <div key={uid}>
        <div>{title}</div>
        <div onClick={() => toggleDetailsVisibility(uid)} style={{ cursor: 'pointer' }}>Show details</div>
        {isDetailsVisible[uid] && (
          <div>
            <div>
              {moment(start).format("MMM D, YYYY")}{" "}
              {moment(start).format("h:mm A")} -{" "}
              {moment(end).format("h:mm A")}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
        {getKeysAsType<ActivityType>(activityTypeToLabel).map((activityType) => (
            <div className={styles.col}>
                <h2>{activityTypeToLabel[activityType]}</h2>
                {activityEvents.filter((event)=>event.type === activityType).map((event) => (
                    <EventItem event={event} key={event.uid} />
                ))}
            </div>
        ))}
    </div>
  );
};

export default ShowEventsByType;

