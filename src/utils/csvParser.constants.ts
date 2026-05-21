export const CSV_COLUMN = {
  ORGANIZATION_NAME: 'Organization Name',
  MISSION: 'Mission',
  WEBSITE: 'Website',
  CONTACT_EMAIL: 'Contact Email',
  HEADQUARTERS_ADDRESS: 'Headquarters Address',
  STREET: 'Street',
  CITY: 'City',
  STATE_PROVINCE: 'State/Province',
  STATE_PROVINCE_ALT: 'State Province',
  COUNTRY: 'Country',
  ZIP_POSTAL_CODE: 'Zip/Postal Code',
  ZIP_POSTAL_CODE_ALT: 'ZipPostal Code',
  SITE_LATITUDE: 'Site Latitude',
  SITE_LONGITUDE: 'Site Longitude'
} as const;

export const CSV_HEADER_MARKERS = [
  CSV_COLUMN.ORGANIZATION_NAME,
  CSV_COLUMN.SITE_LATITUDE
] as const;
