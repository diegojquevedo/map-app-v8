import type { Organization } from '../MapView.d';
import type { ParsedOrganizationPopup } from './MapViewPopupContent.d';
import { DEFAULT_ORGANIZATION_NAME, DEFAULT_MISSION, DEFAULT_LOCATION } from './MapViewPopupContent.constants';

export const parseOrganizationForPopup = (organization: Organization): ParsedOrganizationPopup => {
  const name = organization.organizationName ?? DEFAULT_ORGANIZATION_NAME;
  const mission = organization.mission ?? DEFAULT_MISSION;
  const website = organization.website ?? '';
  const email = organization.contactEmail ?? '';

  const locationParts = [
    organization.headquartersAddress,
    organization.city,
    organization.stateProvince,
    organization.country
  ].filter(Boolean);
  const location = locationParts.length ? locationParts.join(', ') : DEFAULT_LOCATION;

  return { name, mission, website, email, location };
};
