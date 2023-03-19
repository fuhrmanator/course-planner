export interface CalEvent {
    start: Date;
    end: Date;
    title: string;
    type: CalEventType;
    uid: string;
    colour?: string;
}

export interface CalEventTypeColour {
    type: CalEventType,
    colour: string
}

export enum CalEventType {
    Seminar,
    Laboratories,
    Evaluation,
    Homework,
    Undefined,
    Practica,
    Projection
}