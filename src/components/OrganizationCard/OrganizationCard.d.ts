export interface Organization {
  organizationName: string;
  mission: string;
  website: string;
  contactEmail: string;
  headquartersAddress: string;
  street: string;
  city: string;
  stateProvince: string;
  country: string;
  zipPostalCode: string;
  siteLatitude: number;
  siteLongitude: number;
}

export interface OrganizationCardProps { 
  organization: Organization; 
  isSelected?: boolean;
  onClick: (org: Organization) => void; 
}

export interface ParsedOrganizationCard {
  address: string;
  hasMission: boolean;
  hasAddress: boolean;
  hasWebsite: boolean;
  hasEmail: boolean;
}
