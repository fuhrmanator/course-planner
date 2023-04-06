import {hasCutoffDate, setHomeworkEnd} from "@/components/controller/util/eventsOperations";
import {event} from "next/dist/build/output/log";

export interface CourseEvent {
    start: Date;
    end: Date;
    due?:Date; // for homework only
    cutoff?:Date;
    title: string;
    type: EventType;
    uid: string;

    dsl?:string;
    unsavedState?: CourseEvent|null; // null means it's an unsavedState of another CourseEvent
    path: string;
}



export interface EventTypeColour {
    type: EventType,
    colour: string
}

export enum EventType {
    Seminar,
    Laboratory,
    Evaluation,
    Homework,
    Practicum
}

export enum EventDate {
    Start = "start",
    End = "end"
}

export interface ActivityEvent extends CourseEvent {
    path : string
}

export type ActivityType = EventType.Homework | EventType.Evaluation
export type CourseType = EventType.Seminar | EventType.Laboratory | EventType.Practicum
export type TypeColourDict = {[key in EventType]: string};
export type SuggestionTypeMapConfig = {[key in ActivityType]: CourseType};