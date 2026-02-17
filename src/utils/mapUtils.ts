import { Organization } from '../components/App/App.d';
import { MapBounds } from './mapUtils.d';
import {
  LATITUDE_MAX,
  LATITUDE_MIN,
  LONGITUDE_MAX,
  LONGITUDE_MIN,
  BOUNDS_PADDING_FACTOR,
  CENTER_AVERAGE_DIVISOR,
  EARTH_RADIUS_KM,
  DEGREES_TO_RADIANS,
  HAVERSINE_HALF_ANGLE_DIVISOR,
  HAVERSINE_ANGULAR_MULTIPLIER,
  CARDINAL_NORTH,
  CARDINAL_SOUTH,
  CARDINAL_EAST,
  CARDINAL_WEST,
  MARKER_ELEMENT_CLASSES
} from './mapUtils.constants';

export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return !isNaN(lat) && !isNaN(lng) &&
         lat >= LATITUDE_MIN && lat <= LATITUDE_MAX &&
         lng >= LONGITUDE_MIN && lng <= LONGITUDE_MAX;
};

export const validateOrganizationCoordinates = (org: Organization): boolean => {
  return isValidCoordinate(org.siteLatitude, org.siteLongitude);
};

export const calculateBounds = (organizations: Organization[]): MapBounds | null => {
  const validOrgs = organizations.filter(validateOrganizationCoordinates);

  if (!validOrgs.length) {
    return null;
  }

  const { north, south, east, west } = validOrgs.reduce(
    (acc, org) => ({
      north: Math.max(acc.north, org.siteLatitude),
      south: Math.min(acc.south, org.siteLatitude),
      east: Math.max(acc.east, org.siteLongitude),
      west: Math.min(acc.west, org.siteLongitude)
    }),
    { north: LATITUDE_MIN, south: LATITUDE_MAX, east: LONGITUDE_MIN, west: LONGITUDE_MAX }
  );

  const latPadding = (north - south) * BOUNDS_PADDING_FACTOR;
  const lngPadding = (east - west) * BOUNDS_PADDING_FACTOR;

  return {
    north: Math.min(LATITUDE_MAX, north + latPadding),
    south: Math.max(LATITUDE_MIN, south - latPadding),
    east: Math.min(LONGITUDE_MAX, east + lngPadding),
    west: Math.max(LONGITUDE_MIN, west - lngPadding)
  };
};

export const getMapCenter = (bounds: MapBounds): [number, number] => {
  const centerLng = (bounds.east + bounds.west) / CENTER_AVERAGE_DIVISOR;
  const centerLat = (bounds.north + bounds.south) / CENTER_AVERAGE_DIVISOR;
  return [centerLng, centerLat];
};

export const createMarkerElement = (organization: Organization): HTMLElement => {
  const el = document.createElement('div');
  el.className = MARKER_ELEMENT_CLASSES;
  el.setAttribute('data-organization-id', organization.organizationName);
  return el;
};

export const formatCoordinates = (lat: number, lng: number): string => {
  const latitudeDirection = lat >= 0 ? CARDINAL_NORTH : CARDINAL_SOUTH;
  const longitudeDirection = lng >= 0 ? CARDINAL_EAST : CARDINAL_WEST;
  return `${Math.abs(lat).toFixed(4)}°${latitudeDirection}, ${Math.abs(lng).toFixed(4)}°${longitudeDirection}`;
};

export const getDistanceBetweenPoints = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const deltaLatitudeRadians = (lat2 - lat1) * DEGREES_TO_RADIANS;
  const deltaLongitudeRadians = (lng2 - lng1) * DEGREES_TO_RADIANS;
  const haversineA =
    Math.sin(deltaLatitudeRadians / HAVERSINE_HALF_ANGLE_DIVISOR) * Math.sin(deltaLatitudeRadians / HAVERSINE_HALF_ANGLE_DIVISOR) +
    Math.cos(lat1 * DEGREES_TO_RADIANS) * Math.cos(lat2 * DEGREES_TO_RADIANS) *
    Math.sin(deltaLongitudeRadians / HAVERSINE_HALF_ANGLE_DIVISOR) * Math.sin(deltaLongitudeRadians / HAVERSINE_HALF_ANGLE_DIVISOR);
  const angularDistanceRadians = HAVERSINE_ANGULAR_MULTIPLIER * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));
  return EARTH_RADIUS_KM * angularDistanceRadians;
};
