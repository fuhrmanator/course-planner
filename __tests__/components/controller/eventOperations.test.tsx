import {describe, expect, test} from '@jest/globals';
import { CourseEvent, EventType } from '@/components/model/interfaces/events/courseEvent';
import { findEarliestEvent } from '@/components/controller/util/eventsOperations';

const startDate = new Date();
const endDate = createDateWithOffset(startDate, 10);
const basicEvent:CourseEvent = {
  start: startDate,
  end: endDate,
  title:"title",
  uid:"uid",
  type: EventType.Evaluation
};

function createDateWithOffset(date:Date, offest:number) {
  return new Date(date.getTime() + offest);
}

function shuffleArray(array:any) {
  return array.sort(() => Math.random() - 0.5);
}


describe('CalEvent operations', () => {
  test('Finds the earliest event', () => {
    const events: CourseEvent[] = [];
    let expectedEarliest;
    for (let i=0; i<10; i++) {
      events.push({...basicEvent});
      events[i].start = createDateWithOffset(events[i].start, i*1000);
      events[i].end = createDateWithOffset(events[i].end, i*1000);
      if (i==0) {
        expectedEarliest = events[i];
      }
    }
    const earliest = findEarliestEvent(shuffleArray(events));
    expect(earliest).toBe(expectedEarliest);
  });
});
