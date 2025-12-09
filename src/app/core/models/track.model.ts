import { Artist } from './artist.model';
import { Album } from './album.model';


export interface Track {

  id: string;
  
  name: string;
  
  artists: Artist[];
  
  album: Album;
  
  duration_ms: number;
  
  preview_url: string | null;
}
