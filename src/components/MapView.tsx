import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapViewProps } from '../utils/types';
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM, MAP_MAX_ZOOM, MAP_MIN_ZOOM, MARKER_COLOR, POPUP_MAX_WIDTH } from '../utils/constants';

export const MapView: React.FC<MapViewProps> = ({ organizations, selectedOrganization, onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const mapboxToken = (import.meta as any).env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: MAP_INITIAL_CENTER,
      zoom: MAP_INITIAL_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      minZoom: MAP_MIN_ZOOM
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const validOrganizations = organizations.filter(org => 
      !isNaN(org.siteLatitude) && 
      !isNaN(org.siteLongitude) && 
      org.siteLatitude !== 0 && 
      org.siteLongitude !== 0 &&
      org.siteLatitude >= -90 && 
      org.siteLatitude <= 90 &&
      org.siteLongitude >= -180 && 
      org.siteLongitude <= 180
    );

    validOrganizations.forEach(org => {
      const el = document.createElement('div');
      el.className = 'w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform';
      el.style.backgroundColor = MARKER_COLOR;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([org.siteLongitude, org.siteLatitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onMarkerClick(org);
      });

      markers.current.push(marker);
    });

    if (validOrganizations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validOrganizations.forEach(org => {
        bounds.extend([org.siteLongitude, org.siteLatitude]);
      });

      if (bounds.getNorthEast().lng !== bounds.getSouthWest().lng && 
          bounds.getNorthEast().lat !== bounds.getSouthWest().lat) {
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 10 });
      }
    }
  }, [organizations, mapLoaded, onMarkerClick]);

  useEffect(() => {
    if (!map.current || !selectedOrganization) return;

    if (popup.current) {
      popup.current.remove();
    }

    const isValidCoordinate = !isNaN(selectedOrganization.siteLatitude) && 
                             !isNaN(selectedOrganization.siteLongitude) &&
                             selectedOrganization.siteLatitude !== 0 && 
                             selectedOrganization.siteLongitude !== 0;

    if (!isValidCoordinate) return;

    const popupContent = `
      <div class="p-4 max-w-sm">
        <h3 class="font-bold text-lg mb-2 text-gray-900">${selectedOrganization.organizationName || 'Unknown Organization'}</h3>
        <p class="text-sm text-gray-600 mb-3">${selectedOrganization.mission || 'No mission statement available'}</p>
        <div class="space-y-1 text-xs text-gray-500">
          <p><strong>Location:</strong> ${selectedOrganization.city || 'Unknown'}, ${selectedOrganization.country || 'Unknown'}</p>
          ${selectedOrganization.website ? `<p><strong>Website:</strong> <a href="${selectedOrganization.website}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${selectedOrganization.website}</a></p>` : ''}
          ${selectedOrganization.contactEmail ? `<p><strong>Email:</strong> <a href="mailto:${selectedOrganization.contactEmail}" class="text-blue-600 hover:underline">${selectedOrganization.contactEmail}</a></p>` : ''}
        </div>
      </div>
    `;

    popup.current = new mapboxgl.Popup({
      maxWidth: POPUP_MAX_WIDTH,
      closeButton: true,
      closeOnClick: false
    })
      .setLngLat([selectedOrganization.siteLongitude, selectedOrganization.siteLatitude])
      .setHTML(popupContent)
      .addTo(map.current);

    map.current.flyTo({
      center: [selectedOrganization.siteLongitude, selectedOrganization.siteLatitude],
      zoom: Math.max(map.current.getZoom(), 8),
      duration: 1000
    });
  }, [selectedOrganization]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};