import { CalEventType } from "@/components/model/interfaces/events/calEvent";

export const QUIZ_START_DATE = "timeopen";
export const QUIZ_END_DATE = "timeclose";
export const ASSIGN_START_DATE = "allowsubmissionsfromdate";
export const ASSIGN_END_DATE = "duedate";
export const ACTIVITY_TYPE = "modulename";
export const ACTIVITY_WRAPPER = "activity";
export const ACTIVITY_ID = "moduleid";
export const ACTIVITY_NAME = "name";
export const ACTIVITY_TO_JS: {[key: string]: CalEventType } = {
    "quiz": CalEventType.Evaluation,
    "assign": CalEventType.Homework
}
export const INDEX_PATH_TO_ACTIVITIES = ["moodle_backup","information","contents","activities","activity"]