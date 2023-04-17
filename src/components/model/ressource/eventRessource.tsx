import {
    ActivityDateProp,
    ActivityType,
    CourseEvent,
    CourseType,
    CoursEventDateGetter,
    EventType,
    SuggestionTypeMapConfig,
    TypeColourDict
} from "@/components/model/interfaces/courseEvent";
import {DSLDateRef} from "../interfaces/dsl";
import {EVALUATION_INDEX, HOMEWORK_INDEX, OPEN_INDEX} from "@/components/model/ressource/dslRessource";

export const DEFAULT_EVENT_COLOUR: TypeColourDict = {
    [EventType.Seminar]: "#3a20fe",
    [EventType.Practicum]: "#5f2596",
    [EventType.Laboratory]: "#00ff88",
    [EventType.Evaluation]: "#ff2e2e",
    [EventType.Homework]: "#ffbb00"
};


export const ACTIVITY_TYPE_TO_DATE_PROP: { [key in ActivityType]: ActivityDateProp[] } = {
    // values order has to match DSL order.
    [EventType.Evaluation]: [{
        getter: (e: CourseEvent) => e.start,
        label: "Début",
        dslIndex: OPEN_INDEX
    },
    {
        getter: (e: CourseEvent) => e.end,
        label: "Fin",
        dslIndex: EVALUATION_INDEX.close
    }],
    [EventType.Homework]: [{
        getter: (e: CourseEvent) => e.start,
        label: "Début",
        dslIndex: OPEN_INDEX
    },
    {
        getter: (e: CourseEvent) => e.due,
        label: "Début remise",
        dslIndex: HOMEWORK_INDEX.due
    },
    {
        getter: (e: CourseEvent) => e.cutoff,
        label: "Remise finale",
        dslIndex: HOMEWORK_INDEX.cutoff
    }]
}

export const COURSE_DATE_TO_GETTER: { [key in DSLDateRef]: CoursEventDateGetter } = {
    [DSLDateRef.Start]: (e: CourseEvent) => e.start,
    [DSLDateRef.End]: (e: CourseEvent) => e.end
}

export const ACTIVITY_TYPE_TO_LABEL: { [key in ActivityType]: string } = {
    [EventType.Homework]: "Devoir",
    [EventType.Evaluation]: "Évaluation",
};

export const COURSE_TYPE_TO_LABEL: { [key in CourseType]: string } = {
    [EventType.Seminar]: "Cours",
    [EventType.Practicum]: "TP",
    [EventType.Laboratory]: "Laboratoire",
};

export const EVENT_TYPE_TO_LABEL: { [key in EventType]: string } = {...ACTIVITY_TYPE_TO_LABEL, ...COURSE_TYPE_TO_LABEL};
export const DEFAULT_SUGGESTION_TYPE_MAPPING: SuggestionTypeMapConfig = {
    [EventType.Homework]: [EventType.Laboratory],
    [EventType.Evaluation]: [EventType.Seminar],
};
