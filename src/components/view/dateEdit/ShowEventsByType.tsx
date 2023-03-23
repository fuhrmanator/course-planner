import { EventModelContext } from "@/components/model/EventModel";
import { EventType, CourseEvent } from "@/components/model/interfaces/courseEvent";
import styles from "@/components/view/style/ShowEventsByType.module.css";
import React, { useContext, useState } from "react";
import moment from "moment";
import EventItem from "@/components/view/dateEdit/EventItem";


const ShowEventsByType: React.FC = () => {
  const { events } = useContext(EventModelContext);

  const homeworkEvents = events.filter(
    (event) => event.type === EventType.Homework
  );
  const evaluationEvents = events.filter(
    (event) => event.type === EventType.Evaluation
  );

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
      <div className={styles.col}>
        <h2>Devoir</h2>
        {homeworkEvents.map((event) => (
          <EventItem event={event} key={event.uid} />
        ))}
      </div>
      <div className={styles.col}>
        <h2>Quiz</h2>
        {evaluationEvents.map((event) => (
          <EventItem event={event} key={event.uid} />
        ))}
      </div>
    </div>
  );
};

export default ShowEventsByType;

