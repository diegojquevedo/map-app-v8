import React from 'react';
import { OrganizationPopupProps } from '../utils/types';

export const OrganizationPopup: React.FC<OrganizationPopupProps> = ({ organization }) => {
  const formatWebsite = (website: string): string => {
    if (!website) return '';
    return website.startsWith('http') ? website : `https://${website}`;
  };

  const formatAddress = (): string => {
    const parts = [
      organization.street,
      organization.city,
      organization.stateProvince,
      organization.country,
      organization.zipPostalCode
    ].filter(part => part && part.trim() !== '');
    
    return parts.join(', ');
  };

  return (
    <div className="max-w-sm p-4 space-y-3">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {organization.organizationName}
        </h3>
        {organization.mission && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {organization.mission}
          </p>
        )}
      </div>

      {formatAddress() && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-1">Address</h4>
          <p className="text-sm text-gray-600">
            {formatAddress()}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {organization.website && (
          <div>
            <a
              href={formatWebsite(organization.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {organization.contactEmail && (
          <div>
            <a
              href={`mailto:${organization.contactEmail}`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Contact Email
            </a>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {organization.siteLatitude?.toFixed(4)}, {organization.siteLongitude?.toFixed(4)}
        </p>
      </div>
    </div>
  );
};