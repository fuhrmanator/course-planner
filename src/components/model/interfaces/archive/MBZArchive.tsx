
import { ArchiveDict } from "./archiveTypes";
import ArchiveFile from "./archiveFile";

export default class MBZArchive {
    main?: ArchiveFile;
    activities: ArchiveDict;
    other: ArchiveDict;

    constructor() {
        this.activities = {}
        this.other = {}
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
        if (this.main)
            allFiles[this.main?.name] = this.main;
        return allFiles;
    }

    throwIfNoMain(): void {
        if (typeof this.main === "undefined") {
            throw new Error("No moodle_backup.xml file in the provided archive. Please provide a valid moodle backup")
        }
    }
}