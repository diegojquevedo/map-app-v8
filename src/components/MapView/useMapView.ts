import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Organization } from './MapView.d';
import { MAP_INITIAL_CENTER, MAP_INITIAL_ZOOM, MAP_MAX_ZOOM, MAP_MIN_ZOOM, MAPBOX_TOKEN, MARKER_COLOR } from '../../constants/constants';
import {
  FIT_BOUNDS_PADDING,
  FIT_BOUNDS_MAX_ZOOM,
  FLY_TO_DURATION,
  FLY_TO_CURVE,
  FLY_TO_SPEED,
  FLY_TO_MIN_ZOOM,
  MAPBOX_TOKEN_ERROR_MESSAGE,
  MAP_STYLE,
  MARKER_CLASSES
} from './MapView.constants';
import { renderPopupContent } from './MapView.utils';
import { isValidCoordinate } from '../../utils/mapUtils';

export const useMapView = (
  organizations: Organization[],
  selectedOrganization: Organization | null,
  onMarkerClick: (org: Organization) => void
) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const onMarkerClickRef = useRef(onMarkerClick);
  const [mapLoaded, setMapLoaded] = useState(false);

  onMarkerClickRef.current = onMarkerClick;

  const popupUnmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.error(MAPBOX_TOKEN_ERROR_MESSAGE);
      return;
    }

    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
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

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    const validOrganizations = organizations.filter(org => 
      isValidCoordinate(org.siteLatitude, org.siteLongitude)
    );

    validOrganizations.forEach(org => {
      const el = document.createElement('div');
      el.className = MARKER_CLASSES;
      el.style.backgroundColor = MARKER_COLOR;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([org.siteLongitude, org.siteLatitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onMarkerClickRef.current(org);
      });

      markers.current.push(marker);
    });

    if (validOrganizations.length) {
      const bounds = new mapboxgl.LngLatBounds();
      validOrganizations.forEach(org => {
        bounds.extend([org.siteLongitude, org.siteLatitude]);
      });

      if (bounds.getNorthEast().lng !== bounds.getSouthWest().lng && 
          bounds.getNorthEast().lat !== bounds.getSouthWest().lat) {
        map.current.fitBounds(bounds, { padding: FIT_BOUNDS_PADDING, maxZoom: FIT_BOUNDS_MAX_ZOOM });
      }
    }
  }, [organizations, mapLoaded]);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (popup.current) {
      popupUnmountRef.current?.();
      popupUnmountRef.current = null;
      popup.current.remove();
      popup.current = null;
    }

    if (!selectedOrganization) return;

    const isValid = isValidCoordinate(
      selectedOrganization.siteLatitude,
      selectedOrganization.siteLongitude
    );

    if (!isValid) return;

    popupUnmountRef.current?.();

    const popupContainer = document.createElement('div');
    popupUnmountRef.current = renderPopupContent(popupContainer, selectedOrganization);

    popup.current = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false
    })
      .setLngLat([selectedOrganization.siteLongitude, selectedOrganization.siteLatitude])
      .setDOMContent(popupContainer)
      .addTo(map.current);

    const currentZoom = map.current.getZoom();
    const targetZoom = Math.max(currentZoom, FLY_TO_MIN_ZOOM);

    map.current.flyTo({
      center: [selectedOrganization.siteLongitude, selectedOrganization.siteLatitude],
      zoom: targetZoom,
      duration: FLY_TO_DURATION,
      curve: FLY_TO_CURVE,
      speed: FLY_TO_SPEED,
      essential: true
    });

    return () => {
      popupUnmountRef.current?.();
      popupUnmountRef.current = null;
    };
  }, [selectedOrganization, mapLoaded]);

  return {
    mapContainer,
    mapLoaded
  };
};
