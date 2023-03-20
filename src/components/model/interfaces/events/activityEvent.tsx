import {CourseEvent} from '@/components/model/interfaces/events/courseEvent';

export interface ActivityEvent extends CourseEvent {
    path : string
}