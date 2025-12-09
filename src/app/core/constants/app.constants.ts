
export const SEARCH_DEBOUNCE_TIME = 500;

export const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/300';

export const ALBUM_TYPES = {
  ALBUM: 'ÁLBUM',
  SINGLE: 'SINGLE',
  COMPILATION: 'COMPILACIÓN'
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Token expirado o no autorizado. Intenta recargar.',
  RATE_LIMIT: 'Límite de peticiones alcanzado. Intenta más tarde.',
  GENERIC: 'Error al buscar. Revisa tu conexión.',
  TRACK_NOT_FOUND: 'No se encontró la pista solicitada.'
} as const;
