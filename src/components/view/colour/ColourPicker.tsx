import React from "react";
import {EventType} from "@/components/model/interfaces/courseEvent";

interface Props {
    type: EventType,
    label: string,
    colour: string,
    style?: React.CSSProperties,
    notifyChange: (id: EventType, newColour:string) => void;
}

const ColorPicker: React.FC<Props> = ({type, label, colour, notifyChange, style}) => {
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

                style={style}
            />
        </div>
    );
};

export default ColorPicker;
