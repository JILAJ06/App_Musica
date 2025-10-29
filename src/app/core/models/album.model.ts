import { Image } from './image.model';
import { Artist } from './artist.model';

/**
 * Interfaz que representa un álbum de Spotify
 */
export interface Album {
  /** ID único del álbum */
  id: string;
  
  /** Nombre del álbum */
  name: string;
  
  /** Imágenes de portada del álbum */
  images: Image[];
  
  /** Tipo de álbum (album, single, compilation) */
  album_type?: string;
  
  /** Fecha de lanzamiento (formato: YYYY-MM-DD) */
  release_date?: string;
  
  /** Número total de pistas en el álbum */
  total_tracks?: number;
}

/**
 * Interfaz extendida de álbum con artistas
 * Usado en resultados de búsqueda
 */
export interface AlbumItem extends Omit<Album, 'album_type'> {
  /** Artistas del álbum */
  artists?: Artist[];
}
