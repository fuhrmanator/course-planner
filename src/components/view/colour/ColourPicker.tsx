import React, {useState} from "react";
import {CourseEvent, EventType} from "@/components/model/interfaces/courseEvent";

interface Props {
    type: EventType,
    label: string,
    colour: string,
    notifyChange: (id: EventType, newColour:string) => void;
}

const ColorPicker: React.FC<Props> = ({type, label, colour, notifyChange}) => {
    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        notifyChange(type, event.target.value);
    };

    return (
        <div>
            <label htmlFor={type.toString()}>{label}</label>
            <input
                id={type.toString()}
                type="color"
                value={colour}
                onChange={handleColorChange}
            />
        </div>
    );
};

export default ColorPicker;
