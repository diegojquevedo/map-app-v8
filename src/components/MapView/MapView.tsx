import { MapViewProps } from './MapView.d';
import { useMapView } from './useMapView';
import { When } from '../../commons/When';
import {
  MapContainer,
  MapCanvasContainer,
  LoadingOverlay,
  LoadingContent,
  LoadingSpinner,
  LoadingText
} from './MapView.styled';

export function MapView({ organizations, selectedOrganization, onMarkerClick }: MapViewProps) {
  const { mapContainer, mapLoaded } = useMapView(organizations, selectedOrganization, onMarkerClick);

  return (
    <MapContainer>
      <MapCanvasContainer mapRef={mapContainer} />
      <When condition={!mapLoaded}>
        <LoadingOverlay>
          <LoadingContent>
            <LoadingSpinner />
            <LoadingText>Loading map...</LoadingText>
          </LoadingContent>
        </LoadingOverlay>
      </When>
    </MapContainer>
  );
}
