import { extractData, parseActivities } from '@/components/controller/util/mbzInterpreter';
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

async function readFilesFromDirectory(directoryPath:string, subpath:string=""):Promise<{[key: string]: ArchiveFile}> {
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    const fileData:{[key: string]: ArchiveFile} = {};
  
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);
  
      if (file.isDirectory()) {
        const subdirectoryData = await readFilesFromDirectory(filePath, path.join(subpath, file.name));
        for (let subdirectoryFile in subdirectoryData) {
          fileData[subdirectoryFile] = subdirectoryData[subdirectoryFile];
        }
      } else if (file.isFile()) {
        const fileContent = await fs.promises.readFile(filePath);
        const relativePath = formatPath(path.join(subpath, file.name));
        fileData[relativePath] = {
          buffer: fileContent.buffer,
          type: "",
          name: relativePath,
          namePrefix: "",
          uname: "",
          uid: relativePath,
          ustarFromat: "",
          version: "",
          checksum: 1,
        };
      }
    }
  
    return fileData;
  }

const moodleTypeToEventType = {
  "quiz" : CalEventType.Evaluation,
  "assign" : CalEventType.Homework
};

const eventAttributeToPattern: {[key: string]: RegExp} = {
  "uid": new RegExp("<activity id=\"([0-9]+)\""),
  "title": new RegExp("<name>(.+)<\/name>"),
  "start": new RegExp("(?:(?:<allowsubmissionsfromdate>)|(?:<timeopen>))([0-9]+)(?:(?:<\/allowsubmissionsfromdate>)|(?:<\/timeopen>))"),
  "end": new RegExp("(?:(?:<duedate>)|(?:<timeclose>))([0-9]+)(?:(?:<\/duedate>)|(?:<\/timeclose>))")
}
  
const decoder = new TextDecoder();

describe('MBZ interpreter operations', () => {
  let backupData:{[key: string]: ArchiveFile};
  beforeAll(async()=> {
    backupData = await readFilesFromDirectory(dataPath);
  })

  test('Should extract all supported activities in archive', async () => {
    const backupIndex = fs.readFileSync(path.join(dataPath, indexFileName)).toString();
    let activityCount =0;
    for (let moodleType in moodleTypeToEventType) {
      activityCount += (backupIndex.match(new RegExp("<modulename>"+moodleType+"<\/modulename>", "g")) || []).length
    }
    const parsed = await parseActivities(backupData);
    expect(parsed.length).toBe(activityCount);
  });

  test('Should parse activity data correctly', async () => {
    const parsedActivities = await parseActivities(backupData);
    for (let parsedActivity of parsedActivities) {
      let refActivity = decoder.decode(backupData[parsedActivity.path].buffer);
      for (let attributeToTest in eventAttributeToPattern) {
        let propMatch = refActivity.match(eventAttributeToPattern[attributeToTest]);
        propMatch = propMatch ? propMatch[1] : "not found"
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
