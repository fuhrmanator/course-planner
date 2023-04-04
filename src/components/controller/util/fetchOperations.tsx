const ressourceURL = 'https://portail.etsmtl.ca/ICal/SeancesCours';
/**
 Fetches the course calendar in iCal format for the specified course, group, year, and semester from the ÉTS API.

 @param code - The course code.
 @param group - The course group number.
 @param year - The academic year of the course.
 @param semester - The semester of the course.
 @returns The course calendar in iCal format as a string.
 */
const fetchCourseICAL = async (code: string, group:number, year:number, semester:number): Promise<string> => {
    const url = new URL(ressourceURL);
    url.searchParams.set('Sigle', code);
    url.searchParams.set('Groupe', group < 9 ? "0"+group : ""+group);
    url.searchParams.set('Session', year+""+semester);

    const finalUrl = `/api/proxy?url=${encodeURIComponent(url.href)}`;
    const data  = await fetch(finalUrl);
    const textData = await data.text();
    return textData;
}

export default fetchCourseICAL;