export interface CourseEvent {
    start: Date;
    end: Date;
    title: string;
    type: EventType;
    uid: string;
    unsavedState?: CourseEvent|null; // null means it's an unsavedState of another CourseEvent
}

export interface EventTypeColour {
    type: EventType,
    colour: string
}

export enum EventType {
    Seminar,
    Laboratories,
    Evaluation,
    Homework,
    Practica
}

export interface ActivityEvent extends CourseEvent {
    path : string
}

export type ActivityType = EventType.Homework | EventType.Evaluation
export type CourseType = EventType.Seminar | EventType.Laboratories | EventType.Practica
export type TypeColourDict = {[key in EventType]: string};
