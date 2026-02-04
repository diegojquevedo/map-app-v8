import React from 'react';
import { OrganizationCardProps } from '../utils/types';

export const OrganizationCard: React.FC<OrganizationCardProps> = ({ organization, onClick }) => {
  const handleClick = () => {
    onClick(organization);
  };

  const formatAddress = () => {
    const parts = [
      organization.city,
      organization.stateProvince,
      organization.country
    ].filter(part => part?.trim());
    
    return parts.join(', ');
  };

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-4"
      onClick={handleClick}
    >
      <div className="h-2 bg-black rounded-t-lg"></div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 uppercase mb-2 leading-tight">
          {organization.organizationName}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          {organization.mission && (
            <p className="line-clamp-3">
              {organization.mission}
            </p>
          )}
          
          {formatAddress() && (
            <p className="flex items-start">
              <span className="font-medium mr-1">Location:</span>
              {formatAddress()}
            </p>
          )}
          
          {organization.website && (
            <p className="flex items-start">
              <span className="font-medium mr-1">Website:</span>
              <span className="text-blue-600 hover:text-blue-800 truncate">
                {organization.website}
              </span>
            </p>
          )}
          
          {organization.contactEmail && (
            <p className="flex items-start">
              <span className="font-medium mr-1">Contact:</span>
              <span className="text-blue-600 hover:text-blue-800 truncate">
                {organization.contactEmail}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};