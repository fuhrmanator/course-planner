import React, { useState } from "react";
import { CourseEvent } from "@/components/model/interfaces/courseEvent";
import moment from "moment";

interface EventItemProps {
  event: CourseEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const { uid, title, start, end } = event;

  const [editMode, setEditMode] = useState(false);
  const [newStart, setNewStart] = useState(start);
  const [newEnd, setNewEnd] = useState(end);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStart(new Date(e.target.value));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewEnd(new Date(e.target.value));
  };

  const handleSave = () => {
    event.start = newStart;
    event.end = newEnd;
    setEditMode(false);
  };

  const handleCancel = () => {
    setNewStart(event.start);
    setNewEnd(event.end);
    setEditMode(false);
  };

  return (
    <div key={uid}>
      <div>{title}</div>
      <div onClick={() => setEditMode(!editMode)} style={{ cursor: "pointer" }}>
        {editMode ? "Hide details" : "Show details"}
      </div>
      {editMode && (
        <div>
          <div>
            <label>Start:</label>
            <input
              type="datetime-local"
              value={moment(newStart).format("YYYY-MM-DDTHH:mm")}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label>End:</label>
            <input
              type="datetime-local"
              value={moment(newEnd).format("YYYY-MM-DDTHH:mm")}
              onChange={handleEndDateChange}
            />
          </div>
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventItem;
