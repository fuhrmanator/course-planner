import type {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  if (typeof url === 'undefined') {
    throw new Error("Request url is undefinied");
  }

  const urlObj = new URL(url as string);
  const response = await fetch(urlObj);
  const text = await response.text();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/calendar');
  res.status(200).send(text);
}