import React, { useState, useEffect } from 'react';
import { MapView } from './components/MapView';
import { SearchPanel } from './components/SearchPanel';
import { Organization } from './utils/types';
import { CSV_URL } from './utils/constants';
import { parseCSV, transformCSVToOrganizations } from './utils/csvParser';

export const App: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);

        const isProd = (import.meta as { env?: { PROD?: boolean } }).env?.PROD ?? false;
        const details: string[] = [`URL: ${CSV_URL}`, `Origin: ${window.location.origin}`, `Mode: ${isProd ? 'production' : 'development'}`];

        const response = await fetch(CSV_URL);
        details.push(`Status: ${response.status} ${response.statusText}`);
        details.push(`OK: ${response.ok}`);

        if (!response.ok) {
          const body = await response.text().catch(() => '(no body)');
          details.push(`Response: ${body.substring(0, 200)}`);
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const csvText = await response.text();
        details.push(`Content length: ${csvText.length} chars`);

        const csvRows = parseCSV(csvText);
        const parsedData = transformCSVToOrganizations(csvRows);

        if (parsedData.length === 0) {
          details.push(`Rows parsed: ${csvRows.length}`);
          throw new Error('No valid organizations found in CSV');
        }

        setOrganizations(parsedData);
        setError(null);
        setErrorDetails(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : '';
        setError(msg);
        setErrorDetails([
          `Error: ${msg}`,
          stack ? `Stack: ${stack}` : null,
          `URL tried: ${CSV_URL}`,
          `Origin: ${window.location.origin}`,
          `PROD: ${(import.meta as { env?: { PROD?: boolean } }).env?.PROD ?? 'unknown'}`
        ].filter(Boolean).join('\n'));
        console.error('Error loading CSV data:', err);
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
      <div className="h-screen flex items-center justify-center bg-gray-50 p-6 overflow-auto">
        <div className="text-center max-w-2xl">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">{error}</p>
          {errorDetails && (
            <pre className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded text-left text-xs text-gray-800 whitespace-pre-wrap break-all font-mono overflow-x-auto">
              {errorDetails}
            </pre>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
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