export interface CourseEvent {
    start: Date;
    end: Date;
    title: string;
    type: EventType;
    uid: string;
    colour?: string;
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