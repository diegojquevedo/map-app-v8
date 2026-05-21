import { Organization } from '../components/App/App.d';
import { CSV_COLUMN, CSV_HEADER_MARKERS } from './csvParser.constants';
import { isValidCoordinate } from './mapUtils';

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

function normalizeHeaderValue(value: string): string {
  return value.trim().replace(/"/g, '');
}

function isHeaderRow(values: string[]): boolean {
  const normalized = values.map(normalizeHeaderValue);
  return CSV_HEADER_MARKERS.every(marker => normalized.includes(marker));
}

function findHeaderRowIndex(rows: string[]): number {
  const headerIndex = rows.findIndex(row => isHeaderRow(parseCSVLine(row)));
  return headerIndex === -1 ? 0 : headerIndex;
}

export function parseCSV(csvText: string): CSVRow[] {
  const rows = parseCSVRows(csvText.trim());
  if (rows.length < 2) return [];

  const headerRowIndex = findHeaderRowIndex(rows);
  const headerValues = parseCSVLine(rows[headerRowIndex]);
  const headers = headerValues.map(normalizeHeaderValue);
  const result: CSVRow[] = [];

  for (let i = 0; i < rows.length; i++) {
    if (i === headerRowIndex) continue;

    const values = parseCSVLine(rows[i]);
    const row: CSVRow = {};
    headers.forEach((header, index) => {
      row[header] = (values[index] ?? '').trim();
    });
    result.push(row);
  }

  return result;
}

function getRowValue(row: CSVRow, ...keys: string[]): string {
  return keys
    .map(key => row[key]?.trim() ?? '')
    .find(value => value !== '') ?? '';
}

export function transformCSVToOrganizations(csvRows: CSVRow[]): Organization[] {
  return csvRows
    .map(row => {
      const latitude = parseFloat(getRowValue(row, CSV_COLUMN.SITE_LATITUDE, 'siteLatitude') ?? '0');
      const longitude = parseFloat(getRowValue(row, CSV_COLUMN.SITE_LONGITUDE, 'siteLongitude') ?? '0');

      if (!isValidCoordinate(latitude, longitude)) {
        return null;
      }

      return {
        organizationName: getRowValue(row, CSV_COLUMN.ORGANIZATION_NAME, 'organizationName'),
        mission: getRowValue(row, CSV_COLUMN.MISSION, 'mission'),
        website: getRowValue(row, CSV_COLUMN.WEBSITE, 'website'),
        contactEmail: getRowValue(row, CSV_COLUMN.CONTACT_EMAIL, 'contactEmail'),
        headquartersAddress: getRowValue(row, CSV_COLUMN.HEADQUARTERS_ADDRESS, 'headquartersAddress'),
        street: getRowValue(row, CSV_COLUMN.STREET, 'street'),
        city: getRowValue(row, CSV_COLUMN.CITY, 'city'),
        stateProvince: getRowValue(row, CSV_COLUMN.STATE_PROVINCE, CSV_COLUMN.STATE_PROVINCE_ALT, 'stateProvince'),
        country: getRowValue(row, CSV_COLUMN.COUNTRY, 'country'),
        zipPostalCode: getRowValue(row, CSV_COLUMN.ZIP_POSTAL_CODE, CSV_COLUMN.ZIP_POSTAL_CODE_ALT, 'zipPostalCode'),
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