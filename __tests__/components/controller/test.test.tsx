import {describe, expect, test} from '@jest/globals';
import {
    ActivityEvent,
    ActivityType,
    CourseEvent,
    CourseType,
    EventType,
    SuggestionTypeMapConfig
} from '@/components/model/interfaces/courseEvent';
import {
    addSuggestion,
    cancelAllUnsavedState,
    findEarliestEvent,
    getOrAddUnsavedState,
    hasUnsavedState,
    isUnsavedState,
    removeUnsavedState,
    saveState
} from '@/components/controller/util/eventsOperations';




describe('test', () => {

    test('test', () => {


        let oldCourse:CourseEvent={
            uid: '1',
            title: 'Event 1',
            start: new Date('2022-01-01T09:00:00'),
            end: new Date('2022-01-01T10:00:00'),
            type: EventType.Seminar
        }
    });

});
