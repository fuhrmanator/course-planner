const axios = require('axios');
const ressourceURL = 'https://portail.etsmtl.ca/ICal/SeancesCours?';

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