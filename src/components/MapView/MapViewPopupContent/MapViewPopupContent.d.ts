import type { Organization } from '../MapView.d';

export interface MapViewPopupContentProps {
  organization: Organization;
}

export interface ParsedOrganizationPopup {
  name: string;
  mission: string;
  website: string;
  email: string;
  location: string;
}
