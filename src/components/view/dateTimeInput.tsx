import { useState } from 'react';

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
};

const DateTimeInput: React.FC<Props> = ({ date, onDateChange }) => {
  const [dateString, setDateString] = useState(
    date.toISOString().slice(0, 10) // format ISO pour le input de type date : "yyyy-mm-dd"
  );
  const [timeString, setTimeString] = useState(
    date.toTimeString().slice(0, 5) // format pour le input de type time : "hh:mm"
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDateString = event.target.value;
    setDateString(newDateString);
    const newDate = new Date(`${newDateString}T${timeString}:00`);
    onDateChange(newDate);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTimeString = event.target.value;
    setTimeString(newTimeString);
    const newDate = new Date(`${dateString}T${newTimeString}:00`);
    onDateChange(newDate);
  };

  return (
    <div>
      <input type="date" value={dateString} onChange={handleDateChange} />
      <input type="time" value={timeString} onChange={handleTimeChange} />
    </div>
  );
};
export default DateTimeInput