import { extractData, makeEvents, parseActivities } from '@/components/controller/util/mbz/mbzInterpreter';
import ArchiveFile from '@/components/model/interfaces/archive/archiveFile';
import { CalEventType } from '@/components/model/interfaces/events/calEvent';
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
  "quiz" : CalEventType.Evaluation,
  "assign" : CalEventType.Homework
};

const eventAttributeToPattern: {[key: string]: RegExp} = {
  "uid": new RegExp("<activity id=\"[0-9]+\" moduleid=\"([0-9]+)\""),
  "title": new RegExp("<name>(.+)<\/name>"),
  "start": new RegExp("(?:(?:<allowsubmissionsfromdate>)|(?:<timeopen>))([0-9]+)(?:(?:<\/allowsubmissionsfromdate>)|(?:<\/timeopen>))"),
  "end": new RegExp("(?:(?:<duedate>)|(?:<timeclose>))([0-9]+)(?:(?:<\/duedate>)|(?:<\/timeclose>))")
}
  
const decoder = new TextDecoder();

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
});
