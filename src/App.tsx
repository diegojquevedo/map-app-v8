import React, { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { SearchPanel } from './components/SearchPanel';
import { Organization } from './utils/types';

export const App: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseCsvData = (csvText: string): Organization[] => {
    const lines = csvText.split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Organization[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length < headers.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      const lat = parseFloat(row['siteLatitude'] || row['latitude'] || '0');
      const lng = parseFloat(row['siteLongitude'] || row['longitude'] || '0');

      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) continue;
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) continue;

      const organization: Organization = {
        organizationName: row['organizationName'] || row['name'] || '',
        mission: row['mission'] || row['description'] || '',
        website: row['website'] || '',
        contactEmail: row['contactEmail'] || row['email'] || '',
        headquartersAddress: row['headquartersAddress'] || row['address'] || '',
        street: row['street'] || '',
        city: row['city'] || '',
        stateProvince: row['stateProvince'] || row['state'] || '',
        country: row['country'] || '',
        zipPostalCode: row['zipPostalCode'] || row['zip'] || '',
        siteLatitude: lat,
        siteLongitude: lng
      };

      if (organization.organizationName) {
        data.push(organization);
      }
    }

    return data;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/organizations.csv');
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`);
        }
        const csvText = await response.text();
        const parsedData = parseCsvData(csvText);
        setOrganizations(parsedData);
        setError(null);
      } catch (err) {
        console.error('Error loading CSV data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleOrganizationSelect = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  const handleMarkerClick = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ocean research organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      <div className="h-full grid grid-cols-[30%_70%]">
        <SearchPanel
          organizations={organizations}
          onOrganizationSelect={handleOrganizationSelect}
        />
        <MapView
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  );
};