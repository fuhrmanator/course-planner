import {decompressSync, Zippable, zipSync} from 'fflate';
// @ts-ignore
import FastXML from 'fast-xml-parser';
import {ActivityEvent, EventType} from '@/components/model/interfaces/courseEvent';
import ArchiveFile from '@/components/model/interfaces/archive/archiveFile';
import MBZArchive from '@/components/model/interfaces/archive/MBZArchive';
import * as mbzConstants from '../../model/ressource/mbzConstants';
import {instantiateDSL} from "@/components/controller/util/dsl/dslOperations";

function deleteActivitiesFromArchive(data: MBZArchive, toDelete: ArchiveFile[]):void {
    data.throwIfNoMain();
    const mainFileActivityArray = getElementAtPath(data.main!.parsedData, mbzConstants.INDEX_PATH_TO_ACTIVITIES);
    const mainFileSettingsArray = getElementAtPath(data.main!.parsedData, mbzConstants.INDEX_PATH_TO_SETTINGS);
    for (let fileToDelete of toDelete) {
        // remove activity index
        let idToDelete = getParsedAttribute(fileToDelete.parsedData[mbzConstants.ACTIVITY_WRAPPER], mbzConstants.ACTIVITY_ID);
        for (let i=0; i<mainFileActivityArray.length; i++) { 
            if (mainFileActivityArray[i][mbzConstants.ACTIVITY_ID] == idToDelete) {
                let pathToDelete = mainFileActivityArray[i][mbzConstants.ACTIVITY_DIR];
                data.deleteFilesWithParentPath(pathToDelete);
                mainFileActivityArray.splice(i, 1);
                break;
            }
        }
        // remove activity settings
        let mbzActivityTypeToDelete = getParsedAttribute(fileToDelete.parsedData[mbzConstants.ACTIVITY_WRAPPER], mbzConstants.ACTIVITY_TYPE);
        let settingNameToDelete = makeSettingName(mbzActivityTypeToDelete, idToDelete);
        for (let i=0; i<mainFileSettingsArray.length; i++) {
            if (mainFileSettingsArray[i][mbzConstants.ACTIVITY_SETTING_NAME] === settingNameToDelete) {
                mainFileSettingsArray.splice(i, 1);
                i--;
            }
        }
    }
}

function applyChangesToFile(file: ArchiveFile, event:ActivityEvent):void  {
    const activityLevel = file.parsedData[mbzConstants.ACTIVITY_WRAPPER]
    const mbzType = getParsedAttribute(activityLevel, mbzConstants.ACTIVITY_TYPE);
    const dateLevel = activityLevel[mbzType];
    switch (event.type) {
        case EventType.Evaluation: {
            dateLevel[mbzConstants.QUIZ_START_DATE] = JSDateToMBZ(event.start);
            dateLevel[mbzConstants.QUIZ_END_DATE] = JSDateToMBZ(event.end);
            break;
        }
        case EventType.Homework: {
            dateLevel[mbzConstants.ASSIGN_START_DATE] = JSDateToMBZ(event.start);
            if (typeof event.due !== "undefined") {
                dateLevel[mbzConstants.ASSIGN_DUE_DATE] = JSDateToMBZ(event.due!);
            }

            if (typeof event.cutoff !== "undefined") {
                dateLevel[mbzConstants.ASSIGN_CUTOFF_DATE] = JSDateToMBZ(event.cutoff!);
            }

            break;
        }
    }
}

/**
 * Changes the data of the given archive to match the given events
 * @param data that will be updated with events values
 * @param events values that will update the archive
 */
export const applyChangesToArchive = (data: MBZArchive, events: ActivityEvent[]):void => {
    const activitiesToDelete: ArchiveFile[] = [];
    for (let activityPath in data.activities) {
        let event = events.find((event) => event.path === activityPath);
        if (typeof event === "undefined") {
            activitiesToDelete.push(data.activities[activityPath]);
        } else {
            applyChangesToFile(data.activities[activityPath], event);
        }
    }
    deleteActivitiesFromArchive(data, activitiesToDelete);
}
/**
 * Creates a zip archive with the given data
 * @param data that will be zipped
 */
export const zipData = (data:MBZArchive): Uint8Array => {

  const pathToData: Zippable = {};
  const allFilesToZip = data.getAllFiles();
  for (let path in allFilesToZip) {
    pathToData[path] = getFileDataAsBytes(allFilesToZip[path]);
  }

  return zipSync(pathToData);
}
/**
 * Returns a promise of the extracted data.
 * @param file a file object picked by a HTML input tag. Data must be in the gz.tar format.
 */
export const extractData = async (file:File): Promise<ArchiveFile[]> => {
    
    const fileArrayBuffer = await readFileAsUint8Array(file);
    const unzip = decompressSync(fileArrayBuffer);
    // @ts-ignore
    const module = await import('js-untar'); // dynamic import because importing the module on the server-side will result in a exception becasue the module is looking for the window attribute
    const untar = module.default;

    return await untar(unzip.buffer);
}
/**
 * Creates an MBZArchive representation of the given data. Also transforms all activity data into a JS representation.
 * @param data data to parse
 */
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
        throw new Error("Le fichié sélectionné ne correspond pas à une archive moodle.")
    }

    parseXMLfileToJS(extractedMBZ.main);
    for (let activity of getElementAtPath(extractedMBZ.main.parsedData, mbzConstants.INDEX_PATH_TO_ACTIVITIES)) {
        let moduleMBZType:string = activity[mbzConstants.ACTIVITY_TYPE]
        if (moduleMBZType in mbzConstants.ACTIVITY_TO_JS) {
            let activityPath = makeActivityPath(activity[mbzConstants.ACTIVITY_DIR], moduleMBZType);
            extractedMBZ.registerFileAsActivity(activityPath);
        }
    }
    return extractedMBZ;
    
}
/**
 * Creates the events object based on an extracted MBZArchive. The events dates and ids will correspond to the one present in the given archive.
 * @param data to parse and make events from.
 */
export const makeEvents = (data:MBZArchive):ActivityEvent[] => {
    const calEvents:ActivityEvent[] = [];
    
    for (let activityPath in data.activities) {
        let activityFile = data.activities[activityPath];
        parseXMLfileToJS(activityFile)
        let activityContent = activityFile.parsedData[mbzConstants.ACTIVITY_WRAPPER];
        let activityMbzType = getParsedAttribute(activityContent, mbzConstants.ACTIVITY_TYPE);
        let id = getParsedAttribute(activityContent, mbzConstants.ACTIVITY_ID);
        calEvents.push(mbzToEvent(activityContent[activityMbzType], id, activityPath, activityMbzType));
    }
         
    return calEvents;
};

function getParsedAttribute(obj:any, attributeName:string) {
    return obj[XML_HANDLER_OPTIONS.attributeNamePrefix + attributeName]
}

function JSDateToMBZ(date : Date): string{
    return Math.round(date.getTime()/1000).toString()
}

function mbzDateToJS(mbzDate : string): Date{
    return new Date(parseInt(mbzDate, 10)* 1000);
}

function mbzToEvent(obj:any, id:string, path:string, mbzType: string): ActivityEvent {
    let startDate;
    let endDate;
    let dueDate = undefined;
    let cutoffDate = undefined;
    const title = obj[mbzConstants.ACTIVITY_NAME]
    const type = mbzConstants.ACTIVITY_TO_JS[mbzType];
    switch (type) {
        case EventType.Evaluation: {
            startDate = obj[mbzConstants.QUIZ_START_DATE]
            endDate = obj[mbzConstants.QUIZ_END_DATE]
            break;
        }
        case EventType.Homework: {
            startDate= obj[mbzConstants.ASSIGN_START_DATE]
            const dueObj= obj[mbzConstants.ASSIGN_DUE_DATE]
            const cutoffObj= obj[mbzConstants.ASSIGN_CUTOFF_DATE];
            dueDate = dueObj === 0 ? undefined : dueObj
            cutoffDate = cutoffObj === 0 ? undefined: cutoffObj
            if (typeof cutoffDate !== "undefined") {
                endDate = cutoffDate
            } else if (typeof dueDate !== "undefined") {
                endDate = dueDate
            } else {
                throw Error(`Homework ${title} has no due date or cutoff date. Please provide a moodle backup with homeworks that has at least one of the two`)
            }
            break;
        }
    }

    if (startDate === 0 || endDate === 0) {
        throw Error(`Activity ${title} has no start or end date. Please provide a moodle backup with activities that has them both`)
    }

    return {
        start: mbzDateToJS(startDate),
        end: mbzDateToJS(endDate),
        due: typeof dueDate === "undefined" ? undefined : mbzDateToJS(dueDate),
        cutoff: typeof cutoffDate === "undefined" ? undefined : mbzDateToJS(cutoffDate),
        title: title,
        type: type,
        uid: id,
        dsl: instantiateDSL(type),
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
    if (typeof file.parsedData  !== "undefined") {
        data = encoder.encode(xmlBuilder.build(file.parsedData));
    } else {
        data = new Uint8Array(file.buffer);
    }
    return data;
}

function makeActivityPath(activityFolder:string, type: string) {
    return activityFolder + "/" + type + ".xml"; 
}

function makeSettingName(activityType: string, id: string) {
    return activityType + "_" + id; 
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
  
  function getElementAtPath(object:any, path:string[]): any {
    let currentLevelObj = object;
    for (let pathPart of path) {
        currentLevelObj = currentLevelObj[pathPart]
    }
    return currentLevelObj;
  }