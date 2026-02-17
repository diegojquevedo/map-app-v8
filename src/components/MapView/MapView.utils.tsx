import { createRoot } from 'react-dom/client';
import { MapViewPopupContent } from './MapViewPopupContent/MapViewPopupContent';
import type { Organization } from './MapView.d';

export const renderPopupContent = (container: HTMLElement, organization: Organization) => {
  const root = createRoot(container);
  root.render(<MapViewPopupContent organization={organization} />);
  return () => {
    root.unmount();
  };
};
