import { Image } from './image.model';


export interface Artist {

  id: string;

  name: string;
}

export interface ArtistItem extends Artist {

  images?: Image[];
}


export interface ArtistDetail extends ArtistItem {

  followers?: {
    total: number;
  };
  
 
  genres?: string[];
  
  popularity?: number;
  
  type: string;
  
  uri?: string;
}
