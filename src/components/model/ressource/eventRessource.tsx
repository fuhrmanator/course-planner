import {
    EventType,
    ActivityType, CourseType, TypeColourDict, SuggestionTypeMapConfig
} from "@/components/model/interfaces/courseEvent";

export const defaultEventColours: TypeColourDict = {
    [EventType.Seminar]:"#3a20fe",
    [EventType.Practicum]:"#0055ff",
    [EventType.Laboratory]:"#00ff88",
    [EventType.Evaluation]:"#ff2e2e",
    [EventType.Homework]:"#ffbb00"
};

export const activityTypeToLabel: {[key in ActivityType]: string} = {
    [EventType.Homework]: "Devoir",
    [EventType.Evaluation]: "Évaluation",
};

export const courseTypeToLabel: {[key in CourseType]: string} = {
    [EventType.Seminar]: "Cours",
    [EventType.Practicum]: "TP",
    [EventType.Laboratory]: "Laboratoire",
};

export const eventTypeToLabel: {[key in EventType]: string} = {...activityTypeToLabel, ...courseTypeToLabel};
export const defaultSuggestionTypeMapping: SuggestionTypeMapConfig = {
    [EventType.Homework]: EventType.Laboratory,
    [EventType.Evaluation]: EventType.Seminar,
};