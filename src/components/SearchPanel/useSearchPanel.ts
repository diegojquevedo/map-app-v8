import { useState, useMemo } from 'react';
import { Organization } from './SearchPanel.d';
import { PLURAL_SUFFIX, EMPTY_STATE_NO_SEARCH_MATCH, EMPTY_STATE_NO_ORGANIZATIONS } from './SearchPanel.constants';

export const useSearchPanel = (organizations: Organization[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrganizations = useMemo(() => {
    if (!searchQuery.trim()) {
      return organizations;
    }

    const query = searchQuery.toLowerCase();
    return organizations.filter((org) => {
      return (
        org.organizationName?.toLowerCase().includes(query) ||
        org.mission?.toLowerCase().includes(query) ||
        org.website?.toLowerCase().includes(query) ||
        org.contactEmail?.toLowerCase().includes(query) ||
        org.headquartersAddress?.toLowerCase().includes(query) ||
        org.street?.toLowerCase().includes(query) ||
        org.city?.toLowerCase().includes(query) ||
        org.stateProvince?.toLowerCase().includes(query) ||
        org.country?.toLowerCase().includes(query) ||
        org.zipPostalCode?.toLowerCase().includes(query)
      );
    });
  }, [organizations, searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const hasNoResults = !filteredOrganizations.length;
  const emptyMessage = searchQuery ? EMPTY_STATE_NO_SEARCH_MATCH : EMPTY_STATE_NO_ORGANIZATIONS;
  const organizationText = `${filteredOrganizations.length} organization${filteredOrganizations.length !== 1 ? PLURAL_SUFFIX : ''} found`;

  return {
    searchQuery,
    filteredOrganizations,
    handleSearchChange,
    hasNoResults,
    emptyMessage,
    organizationText
  };
};
