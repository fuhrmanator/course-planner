
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
        this.activities[path] = this.other[path];
        delete this.other[path];
    }

    getAllFiles(): ArchiveDict {
        const allFiles = {...this.activities, ...this.other};
        if (this.main)
            allFiles[this.main?.name] = this.main;
        return allFiles;
    }
}