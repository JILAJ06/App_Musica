import { Artist } from './artist.model';
import { Album } from './album.model';

/**
 * Interfaz que representa una pista de música de Spotify
 */
export interface Track {
  /** ID único de la pista */
  id: string;
  
  /** Nombre de la canción */
  name: string;
  
  /** Lista de artistas que interpretaron la canción */
  artists: Artist[];
  
  /** Información del álbum al que pertenece */
  album: Album;
  
  /** Duración de la pista en milisegundos */
  duration_ms: number;
  
  /** URL de preview de 30 segundos (puede ser null) */
  preview_url: string | null;
}
