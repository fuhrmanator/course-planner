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


describe('Generic event operations', () => {
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

describe('Unsaved state tests', () => {
  let event: CourseEvent;
  let events: CourseEvent[];
  const unsavedStateTitle = "unsavedState"
  beforeEach(()=>{
    event = {
      uid:"Miles davis",
      start: new Date(0),
      end: new Date(10),
      type: EventType.Evaluation,
      title: "Test event"
    };

    const n = 10;
    events = [];
    for (let i =0; i<n; i++) {
      let event ={
        start: new Date(0),
        end : new Date(10),
        title : i.toString(),
        uid : i.toString(),
        type : EventType.Evaluation
      }
      let unsavedState = getOrAddUnsavedState(event)
      unsavedState.title = unsavedStateTitle;
      events.push(event)
    }
  })
  test('Should add unsaved state to event', () => {
    const unsavedState = getOrAddUnsavedState(event);

    expect(unsavedState.start).toBe(event.start)
    expect(unsavedState.end).toBe(event.end)
    expect(unsavedState.uid).toBe(event.uid)
    expect(unsavedState.type).toBe(event.type)
    expect(unsavedState.title).toBe(event.title)

  });
  test('Should get unsaved state of event', () => {
    const unsavedState = getOrAddUnsavedState(event);
    const newTitle = "new title"
    unsavedState.title = newTitle

    const gotUnsavedState = getOrAddUnsavedState(event);

    expect(gotUnsavedState.title).toBe(newTitle)
  });
  test('Modifying unsaved state should not modify event', () => {
    const unsavedState = getOrAddUnsavedState(event);
    const oldTitle = event.title;
    unsavedState.title = "new title"

    expect(event.title).toBe(oldTitle);
  });
  test('Should check if event has unsaved state', () => {
    expect(hasUnsavedState(event)).toBeFalsy();
    getOrAddUnsavedState(event);
    expect(hasUnsavedState(event)).toBeTruthy();
  });
  test('Should remove unsavedState', () => {
    const unsavedState = getOrAddUnsavedState(event);
    expect(event.unsavedState).toBeDefined();

    const removed = removeUnsavedState(event)

    expect(event.unsavedState).toBeUndefined();
    expect(removed).toBe(unsavedState);
  })
  test("Should detect if event is unsaved state", () => {
    expect(isUnsavedState(event)).toBeFalsy();
    const createdUnsavedState = getOrAddUnsavedState(event)
    expect(isUnsavedState(createdUnsavedState)).toBeTruthy();
  })
  test("Should replace event time with unsavedState", ()=> {
    const unsavedState = getOrAddUnsavedState(event);
    const unsavedStart = new Date(event.start.getTime() + 10)
    const unsavedEnd = new Date(event.end.getTime() + 10)
    unsavedState.start = unsavedStart
    unsavedState.end = unsavedEnd

    saveState(event);

    expect(event.unsavedState).toBeUndefined()
    expect(event.start).toBe(unsavedStart)
    expect(event.end).toBe(unsavedEnd)
  })
  test("Should replace  all events time with unsavedState", ()=> {
    const unsavedState = getOrAddUnsavedState(event);
    const unsavedStart = new Date(event.start.getTime() + 10)
    const unsavedEnd = new Date(event.end.getTime() + 10)
    unsavedState.start = unsavedStart
    unsavedState.end = unsavedEnd

    saveState(event);

    expect(event.unsavedState).toBeUndefined()
    expect(event.start).toBe(unsavedStart)
    expect(event.end).toBe(unsavedEnd)
  })
  test("Should remove all unsaved states", ()=> {
    cancelAllUnsavedState(events);

    for (let event of events) {
      expect(event.unsavedState).toBeUndefined();
    }
  })

});

describe('Suggestion', () => {
  let oldCourse: CourseEvent[];
  let newCourse: CourseEvent[];
  let config:SuggestionTypeMapConfig;
  let eventToSuggest:ActivityEvent[];
  let oldStart:Date;
  let oldEnd:Date;
  let usedCourseType:CourseType;
  let unusedCourseType:CourseType;
  let usedActivityType:ActivityType;
  let unusedActivityType:ActivityType;

  beforeAll(() => {
    usedActivityType = EventType.Homework
    unusedActivityType= EventType.Evaluation
    usedCourseType = EventType.Seminar
    unusedCourseType = EventType.Practicum

    oldStart = new Date(0);
    oldEnd = new Date(1*60000);
    oldCourse=[{
      start:oldStart,
      end:oldEnd,
      uid:"old",
      title:"old",
      type:usedCourseType
    }]
    newCourse = [{
      start:new Date(2*60000),
      end:new Date(3*60000),
      uid:"new",
      title:"new",
      type:usedCourseType
    }]
  })
  beforeEach(()=> {
    // @ts-ignore
    config = {
      [usedActivityType]: usedCourseType,
      [unusedActivityType]: unusedCourseType
    }
    eventToSuggest = [{
      start:oldStart,
      end:oldEnd,
      uid:"old",
      title:"old",
      type:usedActivityType,
      path:"path"
    }]

    })

  test('Should not add suggestion if type does not match course', () => {
    config[usedActivityType] = unusedCourseType

    addSuggestion(eventToSuggest, oldCourse, newCourse, config);

    expect(eventToSuggest[0].unsavedState).toBeUndefined();

  });

  test('Should add suggestion if type match course', () => {
    addSuggestion(eventToSuggest, oldCourse, newCourse, config);

    expect(eventToSuggest[0].unsavedState).toBeDefined();

  });

  test('Should suggest date with same offset as reference', () => {
    const offest = 10*60000;
    eventToSuggest[0].start = new Date (oldCourse[0].start.getTime() + offest)

    addSuggestion(eventToSuggest, oldCourse, newCourse, config);

    expect(eventToSuggest[0].unsavedState).toBeDefined();
    expect(eventToSuggest[0].unsavedState!.start.getTime() - newCourse[0].start.getTime()).toBe(offest);
  });
});
