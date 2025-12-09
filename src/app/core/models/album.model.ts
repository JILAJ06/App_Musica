import { Image } from './image.model';
import { Artist } from './artist.model';


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


export interface AlbumItem extends Omit<Album, 'album_type'> {

  artists?: Artist[];
}

export interface AlbumDetail extends Album {

  artists: Artist[];
  
  tracks: {
    items: AlbumTrack[];
  };
  
  copyrights?: Array<{
    text: string;
    type: string;
  }>;
  
  genres?: string[];
  
  label?: string;
  
  popularity?: number;
}

export interface AlbumTrack {
  id: string;
  name: string;
  artists: Artist[];
  duration_ms: number;
  track_number: number;
  preview_url: string | null;
}
