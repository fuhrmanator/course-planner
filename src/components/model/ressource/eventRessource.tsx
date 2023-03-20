import {EventTypeColour, EventType} from "@/components/model/interfaces/events/courseEvent";
export type TypeColourDict = {[key in EventType]: string};
export const defaultEventColours: TypeColourDict = {
    [EventType.Seminar]:"#3a20fe",
    [EventType.Practica]:"#0055ff",
    [EventType.Laboratories]:"#00ff88",
    [EventType.Evaluation]:"#ff2e2e",
    [EventType.Homework]:"#ffbb00"
};

export const eventTypeToLabel: {[key in EventType]: string} = {
    [EventType.Seminar]: "Cours",
    [EventType.Practica]: "TP",
    [EventType.Homework]: "Devoir",
    [EventType.Laboratories]: "Laboratoire",
    [EventType.Evaluation]: "Évaluation",
};