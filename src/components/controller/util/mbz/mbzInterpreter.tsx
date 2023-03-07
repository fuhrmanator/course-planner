import {decompressSync, Zippable, zipSync} from 'fflate';
// @ts-ignore
import FastXML from 'fast-xml-parser';
import { CalEventType } from '@/components/model/interfaces/events/calEvent';
import { MBZEvent } from '@/components/model/interfaces/events/mbzEvent';
import ArchiveFile from '@/components/model/interfaces/archive/archiveFile';
import MBZArchive from '@/components/model/interfaces/archive/MBZArchive';
import * as mbzConstants from './mbzConstants';
import { MBZEventDict } from '@/components/model/eventModel';

function deleteActivitiesFromArchive(data: MBZArchive, toDelete: ArchiveFile[]):void {
    data.throwIfNoMain();
    let mainFileActivityArray = walkDownPath(data.main!.parsedData, mbzConstants.INDEX_PATH_TO_ACTIVITIES);
    for (let activityToDelete of toDelete) {
        delete data.activities[activityToDelete.name];
        for (let i=0; i<mainFileActivityArray.length; i++) {
            if (mainFileActivityArray[i][XML_HANDLER_OPTIONS.attributeNamePrefix + mbzConstants.ACTIVITY_ID] === activityToDelete.uid) {
                mainFileActivityArray.splice(i, 1);
                break;
            }
        }
    }
}

function applyChangesToFile(file: ArchiveFile, event:MBZEvent):void  {
    parseXMLfileToJS(file);
    switch (event.type) {
        case CalEventType.Evaluation: {
            file.parsedData[mbzConstants.QUIZ_START_DATE] = JSDateToMBZ(event.start);
            file.parsedData[mbzConstants.QUIZ_END_DATE] = JSDateToMBZ(event.end);
            break;
        }
        case CalEventType.Homework: {
            file.parsedData[mbzConstants.ASSIGN_START_DATE] = JSDateToMBZ(event.start);
            file.parsedData[mbzConstants.ASSIGN_END_DATE] = JSDateToMBZ(event.end);
            break;
        }
    }
}

export const applyChangesToArchive = (data: MBZArchive, events: MBZEventDict):void => {
    const activitiesToDelete: ArchiveFile[] = [];
    for (let activityPath in data.activities) {
        if (activityPath in events) {
            applyChangesToFile(data.activities[activityPath], events[activityPath]);
        } else {
            activitiesToDelete.push(data.activities[activityPath]);
        }
    }
    deleteActivitiesFromArchive(data, activitiesToDelete);
}

export const zipData = (data:MBZArchive): Uint8Array => {

  const pathToData: Zippable = {};
  const allFilesToZip = data.getAllFiles();
  for (let path in allFilesToZip) {
    pathToData[path] = getFileDataAsBytes(allFilesToZip[path]);
  }

  const serialized = zipSync(pathToData);

  return serialized;
}

export const extractData = async (file:File): Promise<ArchiveFile[]> => {
    
    const fileArrayBuffer = await readFileAsUint8Array(file);
    const unzip = decompressSync(fileArrayBuffer);
    // @ts-ignore
    const module = await import('js-untar'); // dynamic import because importing the module on the server-side will result in a exception becasue the module is looking for the window attribute
    const untar = module.default;

    return await untar(unzip.buffer);
}

export const parseActivities = (data: ArchiveFile[]): MBZArchive => {
    const extractedMBZ = new MBZArchive();
    
    for (let file of data) {
        if (file.name === "moodle_backup.xml") {
            extractedMBZ.main = file;
        } else {
            extractedMBZ.addFile(file);
        }
    }
    if (typeof extractedMBZ.main === "undefined") {
        throw new Error("No moodle_backup.xml file in provided tar. Make sure to upload a moodle backup file.")
    }

    parseXMLfileToJS(extractedMBZ.main);
    for (let activity of walkDownPath(extractedMBZ.main.parsedData, mbzConstants.INDEX_PATH_TO_ACTIVITIES)) {
        let moduleMBZType:string = activity[mbzConstants.ACTIVITY_TYPE]
        if (moduleMBZType in mbzConstants.ACTIVITY_TO_JS) {
            let activityPath = makeMBZpath(activity, moduleMBZType);
            extractedMBZ.registerFileAsActivity(activityPath);
        }
    }
    console.log(extractedMBZ.main.parsedData)
    return extractedMBZ;
    
}

export const makeEvents = (data:MBZArchive):MBZEvent[] => {
    const calEvents:MBZEvent[] = [];
    
    for (let activityPath in data.activities) {
        let activityFile = data.activities[activityPath];
        parseXMLfileToJS(activityFile)
        let activityContent = activityFile.parsedData[mbzConstants.ACTIVITY_WRAPPER];
        let activityMbzType = activityContent[XML_HANDLER_OPTIONS.attributeNamePrefix + mbzConstants.ACTIVITY_TYPE];
        let id = activityContent[XML_HANDLER_OPTIONS.attributeNamePrefix + mbzConstants.ACTIVITY_ID];
        calEvents.push(mbzToEvent(activityContent[activityMbzType], id, activityPath, activityMbzType));
    }
         
    return calEvents;
};

function JSDateToMBZ(date : Date): string{
    return Math.round(date.getTime()/1000).toString()
}

function mbzDateToJS(mbzDate : string): Date{
    return new Date(parseInt(mbzDate, 10)* 1000);
}

function mbzToEvent(obj:any, id:string, path:string, mbzType: string): MBZEvent {
    let startDate;
    let endDate;
    const type = mbzConstants.ACTIVITY_TO_JS[mbzType];
    switch (type) {
        case CalEventType.Evaluation: {
            startDate = obj[mbzConstants.QUIZ_START_DATE]
            endDate = obj[mbzConstants.QUIZ_END_DATE]
            break;
        }
        case CalEventType.Homework: {
            startDate= obj[mbzConstants.ASSIGN_START_DATE]
            endDate= obj[mbzConstants.ASSIGN_END_DATE]
            break;
        }
    }
    return {
        start: mbzDateToJS(startDate),
        end: mbzDateToJS(endDate),
        title: obj[mbzConstants.ACTIVITY_NAME],
        type: type,
        uid: id,
        path: path};
}



const XML_HANDLER_OPTIONS = {
    ignoreAttributes : false,
    attributeNamePrefix : "@_"
};

const xmlParser = new FastXML.XMLParser(XML_HANDLER_OPTIONS);
const xmlBuilder = new FastXML.XMLBuilder(XML_HANDLER_OPTIONS);
const encoder = new TextEncoder();

function parseXMLfileToJS(file: ArchiveFile):any {
    if (typeof file.parsedData === "undefined") {
        file.parsedData = xmlParser.parse(Buffer.from(file.buffer));
    }
}

function getFileDataAsBytes(file: ArchiveFile):Uint8Array {
    let data: Uint8Array;
    if (typeof file.parsedData  === "undefined") {
        data = encoder.encode(xmlBuilder.build(file.parsedData));
    } else {
        data = new Uint8Array(file.buffer);
    }
    return data;
}

function makeMBZpath(jsonActivity: any, type: string) {
    return jsonActivity["directory"] + "/" + type + ".xml"; 
}

function readFileAsUint8Array(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  
  function walkDownPath(object:any, path:string[]): any {
    let currentLevelObj = object;
    for (let pathPart of path) {
        currentLevelObj = currentLevelObj[pathPart]
    }
    return currentLevelObj;
  }