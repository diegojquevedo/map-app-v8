// Shared interfaces:
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

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedOrganization: Organization | null;
}

// Component Props interfaces:
export interface MapViewProps { 
  organizations: Organization[]; 
  selectedOrganization: Organization | null; 
  onMarkerClick: (org: Organization) => void; 
}

export interface SearchPanelProps { 
  organizations: Organization[]; 
  selectedOrganization: Organization | null;
  onOrganizationSelect: (org: Organization) => void;
  onClearSelection: () => void;
}

export interface OrganizationCardProps { 
  organization: Organization; 
  isSelected?: boolean;
  onClick: (org: Organization) => void; 
}

export interface OrganizationPopupProps { 
  organization: Organization; 
}