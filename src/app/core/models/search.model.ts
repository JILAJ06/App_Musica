import { Track } from './track.model';
import { AlbumItem } from './album.model';
import { ArtistItem } from './artist.model';

export interface SearchResponse {
  tracks: {
    items: Track[];
  };
}

export interface SearchAllResponse {
  tracks?: { items: Track[] };
  
  albums?: { items: AlbumItem[] };
  
  artists?: { items: ArtistItem[] };
}
