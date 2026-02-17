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

export interface SearchPanelProps { 
  organizations: Organization[]; 
  selectedOrganization: Organization | null;
  onOrganizationSelect: (org: Organization) => void;
  onClearSelection: () => void;
}
