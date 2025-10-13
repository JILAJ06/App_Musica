import { SpotifyImageResponse } from "./spotify-image-response";
import { SpotifyTrackResponse } from "./spotify-track-response";

export interface SpotifyPlaylistResponse {

    id: string,
    name: string,
    description: string,
    href:string,
    images: SpotifyImageResponse[],
    tracks: {
        items: [
            track: SpotifyTrackResponse
        ]
    }

}
