import React, {useState} from "react";
import {CalEvent, CalEventType} from "@/components/model/interfaces/events/calEvent";

interface Props {
    id: CalEventType,
    label: string,
    colour: string,
    notifyChange: (id: CalEventType, newColour:string) => void;
}

const ColorPicker: React.FC<Props> = ({id, label, colour, notifyChange}) => {
    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        notifyChange(id, event.target.value);
    };

    return (
        <div>
            <label htmlFor={id.toString()}>{label}</label>
            <input
                id={id.toString()}
                type="color"
                value={colour}
                onChange={handleColorChange}
            />
        </div>
    );
};

export default ColorPicker;
