import {decompressSync, Zippable, zipSync} from 'fflate';
// @ts-ignore
import FastXML from 'fast-xml-parser';
import { CalEventType } from '@/components/model/interfaces/events/calEvent';
import { ArchiveDict, ArchiveFile } from '@/components/model/interfaces/archiveFile';
import { MBZEvent } from '@/components/model/interfaces/events/mbzEvent';



function mbzDateToJS(mbzDate : string): Date{
    return new Date(parseInt(mbzDate, 10)* 1000);
}

function applyChangesToArchiveFile(file: ArchiveFile, event:MBZEvent)  {

}

function mbzToQuiz(obj:any, id:string, path:string): MBZEvent {
    return {start: mbzDateToJS(obj["timeopen"]),
            end: mbzDateToJS(obj["timeclose"]),
            title: obj["name"],
            type: CalEventType.Evaluation,
            uid: id,
            path: path};
}

function mbzToHomework(obj:any, id:string, path:string): MBZEvent {
    return {start: mbzDateToJS(obj["allowsubmissionsfromdate"]),
            end: mbzDateToJS(obj["duedate"]),
            title: obj["name"],
            type: CalEventType.Homework,
            uid: id,
            path: path};
}

const mbzActivtiyToCal: {[key: string]: (obj:any, id:string, path:string)=>MBZEvent } = {
    "quiz": mbzToQuiz,
    "assign": mbzToHomework
};

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

export const zipData = (data:ArchiveDict): Uint8Array => {

  const pathToData: Zippable = {};
  for (let path in data) {
    pathToData[path] = new Uint8Array(data[path].buffer);
  }

  const serialized = zipSync(pathToData);

  return serialized;
}

export const extractData = async (file:File): Promise<ArchiveDict> => {

    const fileArrayBuffer = await readFileAsUint8Array(file);
    const unzip = decompressSync(fileArrayBuffer);
    // @ts-ignore
    const module = await import('js-untar'); // dynamic import because importing the module on the server-side will result in a exception becasue the module is looking for the window attribute
    const untar = module.default;

    const data:ArchiveFile[] = await untar(unzip.buffer);
    const pathToFile: ArchiveDict = {}
    for (let file of data) {
        pathToFile[file.name] = file;
    }

    return pathToFile;
    
}

const options = {
    ignoreAttributes : false
};
const xmlParser = new FastXML.XMLParser(options);
const xmlBuilder = new FastXML.XMLBuilder(options);
const encoder = new TextEncoder();

function getFileDataAsJS(file: ArchiveFile):any {
    let data;
    if (file.parsedData) {
        data = file.parsedData;
    } else {
        file.parsedData = xmlParser.parse(Buffer.from(file.buffer));
        data = file.parsedData;
    }
    return data;
}

function getFileDataAsBytes(file: ArchiveFile):Uint8Array {
    let data: Uint8Array;
    if (file.parsedData) {
        data = encoder.encode(xmlBuilder.build(file.parsedData));
    } else {
        data = new Uint8Array(file.buffer);
    }
    return data;
}

export const parseActivities = async (data:ArchiveDict):Promise<MBZEvent[]> => {
        const calEvents:MBZEvent[] = [];
        const activityPaths: string[] = getActivtyPaths(data);
        
        for (let activityPath of activityPaths) {
            let activityFile = data[activityPath];
            let activtiyAsJSON = getFileDataAsJS(activityFile)["activity"]
            activityFile.parsedData = activtiyAsJSON;
            let type = activtiyAsJSON["@_modulename"];
            let id = activtiyAsJSON["@_id"];
            let mappingFcn = mbzActivtiyToCal[type];
            calEvents.push(mappingFcn(activtiyAsJSON[type], id, activityPath));
        }
        
        return calEvents;
};

function getActivtyPaths(data: ArchiveDict):string[] {
    const mainFile = data["moodle_backup.xml"];
    if (mainFile === undefined) {
        throw new Error("No moodle_backup.xml file in provided tar. Make sure to upload a moodle backup file.");
    }
    const mainFileAsJS = getFileDataAsJS(mainFile);
    const calTypeToLocation: string[] = [];
    
    for (let activity of mainFileAsJS["moodle_backup"]["information"]["contents"]["activities"]["activity"] ) {
        let moduleType = activity["modulename"]
        if (moduleType in mbzActivtiyToCal) {
            calTypeToLocation.push(makeMBZpath(activity, moduleType));
        }
    }
    return calTypeToLocation;
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
  