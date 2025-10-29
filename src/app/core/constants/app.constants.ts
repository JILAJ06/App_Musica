/**
 * Constantes de configuración de la aplicación
 */

/** Tiempo de espera (en ms) antes de ejecutar búsqueda automática */
export const SEARCH_DEBOUNCE_TIME = 500;

/** URL de placeholder para imágenes sin portada */
export const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/300';

/** Tipos de álbum soportados por Spotify */
export const ALBUM_TYPES = {
  ALBUM: 'ÁLBUM',
  SINGLE: 'SINGLE',
  COMPILATION: 'COMPILACIÓN'
} as const;

/** Mensajes de error predefinidos */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Token expirado o no autorizado. Intenta recargar.',
  RATE_LIMIT: 'Límite de peticiones alcanzado. Intenta más tarde.',
  GENERIC: 'Error al buscar. Revisa tu conexión.',
  TRACK_NOT_FOUND: 'No se encontró la pista solicitada.'
} as const;
