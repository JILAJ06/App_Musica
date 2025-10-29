import { Image } from './image.model';

/**
 * Interfaz que representa un artista de Spotify
 */
export interface Artist {
  /** ID único del artista */
  id: string;
  
  /** Nombre del artista */
  name: string;
}

/**
 * Interfaz extendida de artista con imágenes
 * Usado en resultados de búsqueda
 */
export interface ArtistItem extends Artist {
  /** Imágenes del artista */
  images?: Image[];
}
