import {ActivityType, CourseType, EventType, TypeColourDict} from "@/components/model/interfaces/courseEvent";

export const defaultEventColours: TypeColourDict = {
    [EventType.Seminar]:"#3a20fe",
    [EventType.Practica]:"#0055ff",
    [EventType.Laboratories]:"#00ff88",
    [EventType.Evaluation]:"#ff2e2e",
    [EventType.Homework]:"#ffbb00"
};

export const activityTypeToLabel: {[key in ActivityType]: string} = {
    [EventType.Homework]: "Devoir",
    [EventType.Evaluation]: "Évaluation",
};

export const courseTypeToLabel: {[key in CourseType]: string} = {
    [EventType.Seminar]: "Cours",
    [EventType.Practica]: "TP",
    [EventType.Laboratories]: "Laboratoire",
};

export const eventTypeToLabel: {[key in EventType]: string} = {...activityTypeToLabel, ...courseTypeToLabel};
