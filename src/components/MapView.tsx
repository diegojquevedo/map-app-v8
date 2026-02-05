import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapViewProps } from '../utils/types';
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM, MAP_MAX_ZOOM, MAP_MIN_ZOOM, MARKER_COLOR } from '../utils/constants';

export const MapView: React.FC<MapViewProps> = ({ organizations, selectedOrganization, onMarkerClick }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    const mapboxToken = (import.meta as any).env.VITE_MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.error('Mapbox token not found');
      return;
    }

    if (!mapContainer.current || map.current) return;

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
        map.current = null;
      }
    };
  }, []);

  // Add markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
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

    // Add markers
    validOrganizations.forEach(org => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform';
      el.style.backgroundColor = MARKER_COLOR;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([org.siteLongitude, org.siteLatitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onMarkerClick(org);
      });

      markers.current.push(marker);
    });

    // Fit bounds to show all markers
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

  // Handle selected organization
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing popup
    if (popup.current) {
      popup.current.remove();
      popup.current = null;
    }

    if (!selectedOrganization) return;

    const isValidCoordinate = !isNaN(selectedOrganization.siteLatitude) && 
                             !isNaN(selectedOrganization.siteLongitude) &&
                             selectedOrganization.siteLatitude !== 0 && 
                             selectedOrganization.siteLongitude !== 0;

    if (!isValidCoordinate) return;

    const name = selectedOrganization.organizationName ?? 'Unknown';
    const mission = selectedOrganization.mission ?? 'No mission available';
    const website = selectedOrganization.website ?? '';
    const email = selectedOrganization.contactEmail ?? '';

    const locationParts = [
      selectedOrganization.headquartersAddress,
      selectedOrganization.city,
      selectedOrganization.stateProvince,
      selectedOrganization.country
    ].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(', ') : 'Location not specified';

    const popupContent = `
      <div class="mapbox-popup-inner">
        <div style="height: 8px; background: #000; border-radius: 8px 8px 0 0;"></div>
        <div style="padding: 16px;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #111827; text-transform: uppercase; line-height: 1.3; padding-right: 24px;">
            ${name}
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 13px; color: #4b5563; line-height: 1.5; max-height: 120px; overflow-y: auto;">
            ${mission}
          </p>
          <div style="font-size: 12px; color: #6b7280; line-height: 1.6;">
            <p style="margin: 0 0 6px 0;"><span style="font-weight: 500;">Location:</span> ${location}</p>
            ${website ? `<p style="margin: 0 0 6px 0; word-break: break-all; overflow-wrap: break-word;">
              <span style="font-weight: 500;">Website:</span>
              <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; word-break: break-all;">${website}</a>
            </p>` : ''}
            ${email ? `<p style="margin: 0; word-break: break-all;">
              <span style="font-weight: 500;">Contact:</span>
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </p>` : ''}
          </div>
        </div>
      </div>
    `;

    // Create and add popup - DEBE flotar sobre el mapa
    
    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })
      .setLngLat([selectedOrganization.siteLongitude, selectedOrganization.siteLatitude])
      .setHTML(popupContent)
      .addTo(map.current);

    // Fly to location
    map.current.flyTo({
      center: [selectedOrganization.siteLongitude, selectedOrganization.siteLatitude],
      zoom: Math.max(map.current.getZoom(), 8),
      duration: 1000
    });

    // Resize map after animation
    setTimeout(() => {
      map.current?.resize();
    }, 100);

  }, [selectedOrganization, mapLoaded]);

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div 
        ref={mapContainer}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100%',
          width: '100%'
        }}
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
