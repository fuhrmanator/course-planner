import {ArchiveDict} from "./archiveTypes";
import ArchiveFile from "./archiveFile";

export default class MBZArchive {
    main?: ArchiveFile;
    activities: ArchiveDict;
    other: ArchiveDict;

    constructor() {
        this.activities = {}
        this.other = {}
    }

    hasData(): boolean {
        return Object.keys(this.activities).length > 0 || Object.keys(this.other).length > 0;
    }

    addFile(file: ArchiveFile): void {
        this.other[file.name] = file;
    }

    registerFileAsActivity(path:string) {
        if (path in this.other) {
            this.activities[path] = this.other[path];
            delete this.other[path];
        }
    }

    getAllFiles(): ArchiveDict {
        const allFiles = {...this.activities, ...this.other};
        if (typeof this.main !== "undefined")
            allFiles[this.main?.name] = this.main;
        return allFiles;
    }

    deleteFilesWithParentPath(parentPath: string) {
        this.deleteFilesWithParentPathFrom(parentPath, this.activities);
        this.deleteFilesWithParentPathFrom(parentPath, this.other);
    }

    private deleteFilesWithParentPathFrom(parentPath: string, deleteFrom: ArchiveDict) {
        const pathsToRemove:string[] = [];
        for (let path in deleteFrom) {
            if (path.includes(parentPath)) {
                pathsToRemove.push(path);
            }
        }
        
        for (let pathToRemove of pathsToRemove) {
            delete deleteFrom[pathToRemove];
        }
    }

    throwIfNoMain(): void {
        if (typeof this.main === "undefined") {
            throw new Error("No moodle_backup.xml file in the provided archive. Please provide a valid moodle backup")
        }
    }
}