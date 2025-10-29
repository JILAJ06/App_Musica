import { Track } from './track.model';
import { AlbumItem } from './album.model';
import { ArtistItem } from './artist.model';

/**
 * Respuesta de búsqueda de pistas
 */
export interface SearchResponse {
  tracks: {
    items: Track[];
  };
}

/**
 * Respuesta completa de búsqueda (pistas, álbumes y artistas)
 */
export interface SearchAllResponse {
  /** Resultados de búsqueda de pistas */
  tracks?: { items: Track[] };
  
  /** Resultados de búsqueda de álbumes */
  albums?: { items: AlbumItem[] };
  
  /** Resultados de búsqueda de artistas */
  artists?: { items: ArtistItem[] };
}
