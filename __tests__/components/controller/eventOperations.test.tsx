import {describe, expect, test} from '@jest/globals';
import { CalEvent, CalEventType } from '@/components/model/interfaces/events/calEvent';
import { addUniqueEvents, findEarliestEvent } from '@/components/controller/util/eventsOperations';
import { EventDict } from '@/components/model/eventModel';

const startDate = new Date();
const endDate = createDateWithOffset(startDate, 10);
const basicEvent:CalEvent = {
  start: startDate,
  end: endDate,
  title:"title",
  uid:"uid",
  type: CalEventType.Evaluation
};

function createDateWithOffset(date:Date, offest:number) {
  return new Date(date.getTime() + offest);
}

function shuffleArray(array:any) {
  return array.sort(() => Math.random() - 0.5);
}


describe('CalEvent operations', () => {
  test('Finds the earliest event', () => {
    const events: CalEvent[] = [];
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

  test('Should only add events with unique uid', () => {
    const addedEvents:EventDict = {};
    const events: CalEvent[] = [];
    const nbEvents = 10;
    for (let i=0; i<nbEvents; i++) {
      events.push({...basicEvent});
      events[i].uid = ""+i;
    }
    addUniqueEvents(events,addedEvents); // add unique events

    expect(Object.keys(addedEvents).length).toBe(nbEvents); // all unique events added

    addUniqueEvents(events,addedEvents); // add non-unique events

    expect(Object.keys(addedEvents).length).toBe(nbEvents); // no new events added

  })
});
