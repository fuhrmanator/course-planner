import {ActivityType, CourseType} from "@/components/model/interfaces/courseEvent";

export type SuggestionTypeMapConfig = { [key in ActivityType]: CourseType };
export interface SuggestionConfig {
    typeMap: SuggestionTypeMapConfig;
    useAbsoluteTime: boolean
}