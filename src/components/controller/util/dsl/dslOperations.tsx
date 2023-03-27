import {CourseEvent, EventType} from "@/components/model/interfaces/courseEvent";
import parser from "./grammar/dsl"
const DSLTypeToJS: {[key: string]: EventType} = {
    "P": EventType.Practicum,
    "L": EventType.Laboratory,
    "S": EventType.Seminar,
    "Q": EventType.Evaluation,
    "E": EventType.Evaluation,
    "H": EventType.Homework
}

export const parseDSL= (dsl:string, activities:CourseEvent[], newCourseEvents:CourseEvent[]):void => {
    console.log(parser.parse(dsl));
}
