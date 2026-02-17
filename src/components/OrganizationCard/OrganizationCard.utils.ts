import type { Organization, ParsedOrganizationCard } from './OrganizationCard.d';

export const parseOrganizationForCard = (organization: Organization): ParsedOrganizationCard => {
  const parts = [
    organization.city,
    organization.stateProvince,
    organization.country
  ].filter(part => part?.trim());
  const address = parts.join(', ');
  
  return {
    address,
    hasMission: !!organization.mission,
    hasAddress: !!address,
    hasWebsite: !!organization.website,
    hasEmail: !!organization.contactEmail
  };
};
