// Archivo estático - se sirve desde el mismo dominio
export const CSV_URL = (import.meta as any).env?.VITE_CSV_URL ?? '/organizations.csv';

export const MAP_INITIAL_CENTER: [number, number] = [0, 20];
export const MAP_INITIAL_ZOOM = 2;
export const MAP_MAX_ZOOM = 18;
export const MAP_MIN_ZOOM = 1;

export const SEARCH_PANEL_WIDTH = '30%';
export const MAP_PANEL_WIDTH = '70%';

export const MARKER_COLOR = '#1e40af';
export const MARKER_SIZE = 8;

export const POPUP_MAX_WIDTH = '400px';
export const POPUP_OFFSET = 15;

export const ANIMATION_DURATION = 300;

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const;

export const Z_INDEX = {
  map: 1,
  searchPanel: 10,
  popup: 20,
  modal: 30
} as const;