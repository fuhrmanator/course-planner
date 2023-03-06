export interface ArchiveFile {
    buffer : ArrayBuffer,
    type : string,
    name : string,
    namePrefix : string,
    uname : string,
    uid: number,
    ustarFromat: string,
    version : string,
    checksum : number,
    parsedData? : any
}

export type ArchiveDict = {[key: string]: ArchiveFile};