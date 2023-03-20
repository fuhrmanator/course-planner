import { applyChangesToArchive, extractData, makeEvents, parseActivities } from '@/components/controller/util/mbz/mbzInterpreter';
import ArchiveFile from '@/components/model/interfaces/archive/archiveFile';
import { EventType } from '@/components/model/interfaces/events/courseEvent';
import {describe, expect, test} from '@jest/globals';
const path = require('path');
const fs = require('fs');
const { TextDecoder } = require('util');

const dataPath = "__tests__/data/mbz/moodleBackup/"
const indexFileName = "moodle_backup.xml"

function formatPath(path:string):string {
    let joined;
 
    if (path.includes("/")) {
      joined = path;
    } else {
      const toJoin = path.split("\\")
      joined = "";
      for (let i=0; i<toJoin.length-1; i++) {
          joined+=toJoin[i]+"/"
      }
      joined+=toJoin[toJoin.length-1];
    }
    return joined;
}

async function readFilesFromDirectory(directoryPath:string, subpath:string=""):Promise<ArchiveFile[]> {
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    let fileData:ArchiveFile[] = [];
  
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);
  
      if (file.isDirectory()) {
        const subdirectoryData = await readFilesFromDirectory(filePath, path.join(subpath, file.name));
        fileData = [...fileData, ...subdirectoryData]
      } else if (file.isFile()) {
        const fileContent = await fs.promises.readFile(filePath);
        const relativePath = formatPath(path.join(subpath, file.name));
        fileData.push({
          buffer: fileContent.buffer,
          type: "",
          name: relativePath,
          namePrefix: "",
          uname: "",
          uid: relativePath,
          ustarFromat: "",
          version: "",
          checksum: 1,
        });
      }
    }
  
    return fileData;
  }

const moodleTypeToEventType = {
  "quiz" : EventType.Evaluation,
  "assign" : EventType.Homework
};

const eventAttributeToPattern: {[key: string]: RegExp} = {
  "uid": new RegExp("<activity id=\"[0-9]+\" moduleid=\"([0-9]+)\""),
  "title": new RegExp("<name>(.+)<\/name>"),
  "start": new RegExp("(?:(?:<allowsubmissionsfromdate>)|(?:<timeopen>))([0-9]+)(?:(?:<\/allowsubmissionsfromdate>)|(?:<\/timeopen>))"),
  "end": new RegExp("(?:(?:<duedate>)|(?:<timeclose>))([0-9]+)(?:(?:<\/duedate>)|(?:<\/timeclose>))")
}
  
const decoder = new TextDecoder();

function findFirstPropWithName(obj:any, names:string[]):any {
  for (const prop in obj) {
    if (names.includes(prop)) {
      return obj[prop];
    }
    if (typeof obj[prop] === 'object') {
      const result = findFirstPropWithName(obj[prop], names);
      if (result !== undefined) {
        return result;
      }
    }
  }
}

function findValueWithTest(obj:any, value:string):any {
  for (const prop in obj) {
    if (typeof obj[prop] === 'string' && obj[prop].includes(value)) {
      return obj[prop];
    } else if (typeof obj[prop] === 'object') {
      const result = findValueWithTest(obj[prop], value);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
}

describe('MBZ interpreter operations', () => {
  let backupData: ArchiveFile[];
  beforeAll(async()=> {
    backupData = await readFilesFromDirectory(dataPath);
  })

  test('Should extract all supported activities in archive',  () => {
    const backupIndex = fs.readFileSync(path.join(dataPath, indexFileName)).toString();
    let activityCount =0;
    for (let moodleType in moodleTypeToEventType) {
      activityCount += (backupIndex.match(new RegExp("<modulename>"+moodleType+"<\/modulename>", "g")) || []).length
    }
    const mbzArchive = parseActivities(backupData);
    expect(Object.keys(mbzArchive.activities).length).toBe(activityCount);
  });

  test('Should parse activity data correctly',  () => {
    const mbzArchive = parseActivities(backupData)
    const parsedActivities =  makeEvents(mbzArchive);
    for (let parsedActivity of parsedActivities) {
      let refActivity = decoder.decode(mbzArchive.activities[parsedActivity.path].buffer);
      for (let attributeToTest in eventAttributeToPattern) {
        let propMatch = refActivity.match(eventAttributeToPattern[attributeToTest]);
        propMatch = propMatch ? propMatch[1] : "test regex unsucessful"
        // @ts-ignore
        let parsedActivityValue = parsedActivity[attributeToTest];
        if (parsedActivityValue  instanceof Date) {
          expect(parsedActivityValue.getTime()).toBe(parseInt(propMatch) * 1000)
        } else {
          expect(parsedActivityValue).toBe(propMatch)
        }
      }
    }
  });

  test('Should adjust archive activity dates', () => {
    const mbzArchive = parseActivities(backupData)
    const parsedActivities = makeEvents(mbzArchive);
    const dateShift = 10000;
    for (let parsedActivity of parsedActivities) {
      parsedActivity.start = new Date(parsedActivity.start.getTime() + dateShift);
      parsedActivity.end = new Date(parsedActivity.end.getTime() + dateShift);
    }
    
    applyChangesToArchive(mbzArchive, parsedActivities);

    for (let activityPath in mbzArchive.activities) {
        let delayedActivity = mbzArchive.activities[activityPath];
        let delayedStart = findFirstPropWithName(delayedActivity.parsedData, ["timeopen", "allowsubmissionsfromdate"])
        let delayedEnd = findFirstPropWithName(delayedActivity.parsedData, ["timeclose", "duedate"])
        let referenceActivity = parsedActivities.find((a) => a.path === activityPath);
        expect(referenceActivity).toBeDefined();
        expect(delayedStart.toString()).toBe((Math.round(referenceActivity!.start.getTime()/ 1000)).toString())
        expect(delayedEnd.toString()).toBe((Math.round(referenceActivity!.end.getTime()/ 1000)).toString())
    }
  })

  test('Should remove events from archive', ()=>{
    const mbzArchive = parseActivities(backupData)
    const parsedActivities = makeEvents(mbzArchive);
    const removedActivites = [];
    const originalAmount = parsedActivities.length;
    const amountToRemove = parsedActivities.length/2;
    for (let i=0; i<amountToRemove; i++) {
      removedActivites.push(parsedActivities[i]);
    }
    parsedActivities.splice(0, amountToRemove);

    applyChangesToArchive(mbzArchive, parsedActivities);
    
    expect(mbzArchive.main).toBeDefined();
    expect(mbzArchive.main?.parsedData).toBeDefined();

    expect(Object.keys(mbzArchive.activities)).toHaveLength(originalAmount-amountToRemove)
    for (let removedActivity of removedActivites) {
      expect(mbzArchive.activities).not.toContain(removedActivity.path)
      // event id should not be in main file anymore
      expect(findValueWithTest(mbzArchive.main?.parsedData, removedActivity.uid)).not.toBeDefined();
    }
  })
});

