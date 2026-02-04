const GOOGLE_SHEETS_URL = process.env.CSV_URL ?? 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9Y4IzZ2ofEbQkuPyc7WA38PO3w4cRNhAOEjGJWDzihMDYvo7Khf_R2oZZr6roRg/pub?output=csv';

export default async function handler(req: { method?: string }, res: { setHeader: (k: string, v: string) => void; status: (n: number) => { end: () => void; send: (s: string) => void; json: (o: object) => void } }) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const csv = await response.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(csv);
  } catch (error) {
    console.error('CSV proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch CSV data' });
  }
}
