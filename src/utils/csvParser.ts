import { Organization } from './types';

export interface CSVRow {
  [key: string]: string;
}

function parseCSVRows(csvText: string): string[] {
  const rows: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        current += char;
      }
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      if (current.trim()) rows.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) rows.push(current);
  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ''));
  return result;
}

export function parseCSV(csvText: string): CSVRow[] {
  const rows = parseCSVRows(csvText.trim());
  if (rows.length < 2) return [];

  const headerValues = parseCSVLine(rows[0]);
  const headers = headerValues.map(h => h.trim().replace(/"/g, ''));
  const result: CSVRow[] = [];

  for (let i = 1; i < rows.length; i++) {
    const values = parseCSVLine(rows[i]);
    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? '').trim();
    });
    result.push(row);
  }

  return result;
}

export function validateCoordinates(latitude: number, longitude: number): boolean {
  return !isNaN(latitude) && 
         !isNaN(longitude) && 
         latitude !== 0 && 
         longitude !== 0 &&
         latitude >= -90 && 
         latitude <= 90 && 
         longitude >= -180 && 
         longitude <= 180;
}

export function transformCSVToOrganizations(csvRows: CSVRow[]): Organization[] {
  return csvRows
    .map(row => {
      const latitude = parseFloat(row['Site Latitude'] ?? row['siteLatitude'] ?? '0');
      const longitude = parseFloat(row['Site Longitude'] ?? row['siteLongitude'] ?? '0');

      if (!validateCoordinates(latitude, longitude)) {
        return null;
      }

      return {
        organizationName: row['Organization Name'] ?? row['organizationName'] ?? '',
        mission: row['Mission'] ?? row['mission'] ?? '',
        website: row['Website'] ?? row['website'] ?? '',
        contactEmail: row['Contact Email'] ?? row['contactEmail'] ?? '',
        headquartersAddress: row['Headquarters Address'] ?? row['headquartersAddress'] ?? '',
        street: row['Street'] ?? row['street'] ?? '',
        city: row['City'] ?? row['city'] ?? '',
        stateProvince: row['State/Province'] ?? row['State Province'] ?? row['stateProvince'] ?? '',
        country: row['Country'] ?? row['country'] ?? '',
        zipPostalCode: row['Zip/Postal Code'] ?? row['ZipPostal Code'] ?? row['zipPostalCode'] ?? '',
        siteLatitude: latitude,
        siteLongitude: longitude
      };
    })
    .filter((org): org is Organization => org !== null && org.organizationName.trim() !== '');
}

export function cleanCSVValue(value: string | undefined | null): string {
  if (!value) return '';
  return value.trim().replace(/^["']|["']$/g, '');
}

export function parseNumericValue(value: string | undefined | null): number {
  const cleaned = cleanCSVValue(value);
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}