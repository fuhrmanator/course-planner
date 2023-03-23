import {SuggestionConfig, SuggestionTypeMapConfig} from "@/components/model/interfaces/suggestion";
import {EventType} from "@/components/model/interfaces/courseEvent";

export const defaultSuggestionTypeMapping: SuggestionTypeMapConfig = {
    [EventType.Homework]: EventType.Laboratories,
    [EventType.Evaluation]: EventType.Seminar,
};

export const defaultSuggestionConfig:SuggestionConfig = {
    typeMap: defaultSuggestionTypeMapping,
    useAbsoluteTime: true
}