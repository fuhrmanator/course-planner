const axios = require('axios');
const ressourceURL = 'https://portail.etsmtl.ca/ICal/SeancesCours?';

const getCoursICAL = async (code: string, group:number, year:number, semester:number): Promise<string> => {
    const url = new URL(ressourceURL);
    url.searchParams.set('Sigle', code);
    url.searchParams.set('Groupe', group < 9 ? "0"+group : ""+group);
    url.searchParams.set('Session', year+""+semester);

    const config = {
        headers: {
            'Content-Type': 'text/calendar',
            'Accept': 'text/calendar',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        }
    }

    const data = await axios.get(url.href, config).catch((err: any) => console.log(err));
    return data.data.toString();

}

export default getCoursICAL;