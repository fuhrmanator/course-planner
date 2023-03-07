import { CalEventType } from "@/components/model/interfaces/events/calEvent";

export const START_DATE_QUIZ = "timeopen";
export const END_DATE_QUIZ = "timeclose";
export const START_DATE_ASSIGN = "allowsubmissionsfromdate";
export const END_DATE_ASSIGN = "duedate";
export const ACTIVITY_TYPE = "modulename";
export const ACTIVITY_WRAPPER = "activity";
export const ACTIVITY_ID = "id";
export const ACTIVITY_TO_JS: {[key: string]: CalEventType } = {
    "quiz": CalEventType.Evaluation,
    "assign": CalEventType.Homework
}
export const INDEX_PATH_TO_ACTIVITIES = ["moodle_backup","information","contents","activities","activity"]