import React, { useState, useMemo } from 'react';
import { SearchPanelProps } from '../utils/types';
import { OrganizationCard } from './OrganizationCard';

export const SearchPanel: React.FC<SearchPanelProps> = ({
  organizations,
  selectedOrganization,
  onOrganizationSelect,
  onClearSelection
}) => {
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

  return (
    <div className="h-full w-full flex flex-col bg-white border-r border-gray-200" style={{ maxHeight: '100vh' }}>
      {/* Header - fixed height */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200" style={{ maxHeight: '180px' }}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ocean Research Organizations
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <svg
            className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-scroll" style={{ height: 0 }}>
        {filteredOrganizations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No organizations match your search.' : 'No organizations available.'}
          </div>
        ) : (
          <div className="p-4">
            {filteredOrganizations.map((org, index) => (
              <div key={`${org.organizationName}-${index}`} className="mb-3">
                <OrganizationCard
                  organization={org}
                  isSelected={selectedOrganization?.organizationName === org.organizationName}
                  onClick={onOrganizationSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
