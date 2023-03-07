import {decompressSync, Zippable, zipSync} from 'fflate';
// @ts-ignore
import FastXML from 'fast-xml-parser';
import { CalEventType } from '@/components/model/interfaces/events/calEvent';
import { MBZEvent } from '@/components/model/interfaces/events/mbzEvent';
import ArchiveFile from '@/components/model/interfaces/archive/archiveFile';
import { ArchiveDict } from '@/components/model/interfaces/archive/archiveTypes';
import MBZArchive from '@/components/model/interfaces/archive/MBZArchive';



function mbzDateToJS(mbzDate : string): Date{
    return new Date(parseInt(mbzDate, 10)* 1000);
}

function applyChangesToArchiveFile(file: ArchiveFile, event:MBZEvent)  {

}

function mbzToEvent(obj:any, id:string, path:string, mbzType: string): MBZEvent {
    let startDate;
    let endDate;
    const type = mbzActivityTypeToJS[mbzType];
    switch (type) {
        case CalEventType.Evaluation: {
            startDate = obj["timeopen"]
            endDate = obj["timeclose"]
            break;
        }
        case CalEventType.Homework: {
            startDate= obj["allowsubmissionsfromdate"]
            endDate= obj["duedate"]
            break;
        }
    }
    return {
        start: mbzDateToJS(startDate),
        end: mbzDateToJS(endDate),
        title: obj["name"],
        type: type,
        uid: id,
        path: path};
}

const mbzActivityTypeToJS: {[key: string]: CalEventType } = {
    "quiz": CalEventType.Evaluation,
    "assign": CalEventType.Homework
}
export const createArchiveWithChanges = (events: MBZEvent[], data: ArchiveDict) => {
    const upToDateData = {...data};
    const eventPaths = []
    for (let event of events) {
        if (!(event.path in data)) {
            console.log("The ${event} is not in the archive you imported therefore it wont be in the exported archive");
            continue;
        }
        applyChangesToArchiveFile(upToDateData[event.path], event);
        eventPaths.push(event.path);
    }
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
    for (let activity of extractedMBZ.main.parsedData["moodle_backup"]["information"]["contents"]["activities"]["activity"] ) {
        let moduleMBZType:string = activity["modulename"]
        if (moduleMBZType in mbzActivityTypeToJS) {
            let activityPath = makeMBZpath(activity, moduleMBZType);
            extractedMBZ.registerFileAsActivity(activityPath);
        }
    }

    return extractedMBZ;
    
}

export const makeEvents = (data:MBZArchive):MBZEvent[] => {
    const calEvents:MBZEvent[] = [];
    
    for (let activityPath in data.activities) {
        let activityFile = data.activities[activityPath];
        parseXMLfileToJS(activityFile)
        let activityContent = activityFile.parsedData["activity"];
        let activityMbzType = activityContent["@_modulename"];
        let id = activityContent["@_id"];
        calEvents.push(mbzToEvent(activityContent[activityMbzType], id, activityPath, activityMbzType));
    }
         
    return calEvents;
};

const options = {
    ignoreAttributes : false
};

const xmlParser = new FastXML.XMLParser(options);
const xmlBuilder = new FastXML.XMLBuilder(options);
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
  