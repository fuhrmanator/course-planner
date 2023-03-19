export interface CalEvent {
    start: Date;
    end: Date;
    title: string;
    type: CalEventType;
    uid: string;
}




export enum CalEventType {
    Seminar,
    Laboratories,
    Evaluation,
    Homework,
    Undefined,
    Practica
}