import {CalEventTypeColour, CalEventType} from "@/components/model/interfaces/events/calEvent";

export const defaultEventColours: CalEventTypeColour[] = [
    {type: CalEventType.Seminar, colour: "#3a20fe"},
    {type: CalEventType.Practica, colour: "#0055ff"},
    {type: CalEventType.Laboratories, colour: "#00ff88"},
    {type: CalEventType.Evaluation, colour: "#ff2e2e"},
    {type: CalEventType.Homework, colour: "#ffbb00"},
];

export const eventTypeToLabel: {[key in CalEventType]?: string} = {
    [CalEventType.Seminar]: "Cours",
    [CalEventType.Practica]: "TP",
    [CalEventType.Homework]: "Devoir",
    [CalEventType.Laboratories]: "Laboratoire",
    [CalEventType.Evaluation]: "Évaluation",
};