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

export interface MapViewProps { 
  organizations: Organization[]; 
  selectedOrganization: Organization | null; 
  onMarkerClick: (org: Organization) => void; 
}
