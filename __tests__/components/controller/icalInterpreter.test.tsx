import {describe, expect, test} from '@jest/globals';
import * as fs from 'fs';
import path from 'path';
import {parseICALEvents} from '@/components/controller/util/icalInterpreter'
import { CourseEvent, EventType } from '@/components/model/interfaces/courseEvent';
const ical = require('ical');
const dataPath = "__tests__/data";

const icalToEventField: {[key: string]: string} = {
  "start": "start",
  "end": "end",
  "uid": "uid",
  "summary": "title"
}

async function getFileContent(filename:string):Promise<string> {
  const data = await fs.promises.readFile(path.join(dataPath, filename));
  return data.toString();
}

function parseIcal(icalData:string): any {
  return ical.parseICS(icalData);
}

function eventEqualExpected(expectedResult: any, toTest: CourseEvent):boolean {
  let isEqual = true;
  for (let expectedField in icalToEventField) {
    // @ts-ignore
    isEqual = isEqual && JSON.stringify(toTest[icalToEventField[expectedField]]) === JSON.stringify(expectedResult[expectedField]);

    }

  return isEqual;
}

function generateUUID() {
  let uuid = '';
  for (let i = 0; i < 32; i++) {
    const randomDigit = Math.floor(Math.random() * 16);
    uuid += randomDigit.toString(16);
  }
  return uuid;
}

describe('ICAL module', () => {
  let icsData: string;
  let icalEvents: any;
  beforeEach(async () => {
    icsData = await getFileContent("valid.ics");
    icalEvents = parseIcal(icsData);
  })

  test('ICAL property are translated to CalEvents', async () => {
    const icsData = await getFileContent("valid.ics");
    const parsedEvents = parseICALEvents(icsData);

    for (let parsedEvent of parsedEvents) {
      expect(parsedEvent.uid in icalEvents).toBeTruthy();
      expect(eventEqualExpected(icalEvents[parsedEvent.uid], parsedEvent)).toBeTruthy();
    }
  });
  test('Parser does not create events with unsupported types', async () => {
    const typeAttribute = "CATEGORIES:";
    const bogusTypeAttribute = typeAttribute + generateUUID();
    const eventNb = Object.keys(icalEvents).length;
    const bogusNb = Math.floor(eventNb / 2);
    let count =0;
    const dataWithBogusTypes = icsData.replace(new RegExp(typeAttribute+".*", "g"), (match, _) => {
      count++;
      return count <= bogusNb ? bogusTypeAttribute : match;
    });
    icalEvents = parseICALEvents(dataWithBogusTypes);
    expect(icalEvents.length).toBe(eventNb - bogusNb);
  });
});
