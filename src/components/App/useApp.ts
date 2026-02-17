import { useState, useEffect } from 'react';
import type { Organization } from './App.d';
import { CSV_URL } from '../../constants/constants';
import { parseCSV, transformCSVToOrganizations } from '../../utils/csvParser';

export const useApp = () => {
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

        if (!parsedData.length) {
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

  const handleClearSelection = () => {
    setSelectedOrganization(null);
  };

  const handleReload = () => {
    window.location.reload();
  };

  return {
    organizations,
    selectedOrganization,
    loading,
    error,
    errorDetails,
    handleOrganizationSelect,
    handleMarkerClick,
    handleClearSelection,
    handleReload
  };
};
