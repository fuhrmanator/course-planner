import {EventTypeColour, EventType} from "@/components/model/interfaces/events/courseEvent";

export const defaultEventColours: EventTypeColour[] = [
    {type: EventType.Seminar, colour: "#3a20fe"},
    {type: EventType.Practica, colour: "#0055ff"},
    {type: EventType.Laboratories, colour: "#00ff88"},
    {type: EventType.Evaluation, colour: "#ff2e2e"},
    {type: EventType.Homework, colour: "#ffbb00"},
];

export const eventTypeToLabel: {[key in EventType]?: string} = {
    [EventType.Seminar]: "Cours",
    [EventType.Practica]: "TP",
    [EventType.Homework]: "Devoir",
    [EventType.Laboratories]: "Laboratoire",
    [EventType.Evaluation]: "Évaluation",
};