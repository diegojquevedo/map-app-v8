import React, { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { SearchPanel } from './components/SearchPanel';
import { Organization } from './utils/types';
import { CSV_URL, CORS_PROXIES } from './utils/constants';
import { parseCSV, transformCSVToOrganizations } from './utils/csvParser';

const fetchCSV = async (url: string): Promise<string> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
};

export const App: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let csvText: string | null = null;
        let lastError: Error | null = null;

        try {
          csvText = await fetchCSV(CSV_URL);
        } catch (err) {
          console.warn('Direct fetch failed:', err);
          lastError = err as Error;
        }

        if (!csvText) {
          for (const proxy of CORS_PROXIES) {
            try {
              const proxyUrl = `${proxy}${encodeURIComponent(CSV_URL)}`;
              console.log('Trying proxy:', proxy);
              csvText = await fetchCSV(proxyUrl);
              console.log('Success with proxy:', proxy);
              break;
            } catch (err) {
              console.warn(`Proxy ${proxy} failed:`, err);
              lastError = err as Error;
            }
          }
        }

        if (!csvText) {
          throw lastError ?? new Error('All fetch attempts failed');
        }

        const csvRows = parseCSV(csvText);
        const parsedData = transformCSVToOrganizations(csvRows);
        
        if (parsedData.length === 0) {
          throw new Error('No valid organizations found in CSV');
        }

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
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      maxHeight: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div style={{ 
        height: '100vh',
        width: '100vw',
        maxHeight: '100vh',
        maxWidth: '100vw',
        display: 'grid',
        gridTemplateColumns: '30% 70%',
        overflow: 'hidden'
      }}>
        <SearchPanel
          organizations={organizations}
          selectedOrganization={selectedOrganization}
          onOrganizationSelect={handleOrganizationSelect}
          onClearSelection={() => setSelectedOrganization(null)}
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