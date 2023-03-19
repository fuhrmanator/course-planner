export default interface ArchiveFile {
    buffer : ArrayBuffer,
    type : string,
    name : string,
    namePrefix : string,
    uname : string,
    uid: string,
    ustarFromat: string,
    version : string,
    checksum : number,
    parsedData? : any
}
