import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyPlaylistResponse } from '../../interfaces/spotify-api/spotify-playlist-response';

@Injectable({
  providedIn: 'root'
})
export class SpotifyPlaylistService {

  constructor(
    private _http: HttpClient
  ){ }

  // Obtiene una playlist pública por ID
  getPlaylistById(token: string, playlistId: string): Observable<SpotifyPlaylistResponse> {
    return this._http.get<SpotifyPlaylistResponse>(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          'Authorization': "Bearer " + token
        }
      }
    );
  }

  // Obtiene varias playlists públicas por sus IDs
  getPublicPlaylists(token: string, playlistIds: string[]): Observable<any[]> {
    // Devuelve un array de observables para cada playlist
    return new Observable(observer => {
      const requests = playlistIds.map(id => this.getPlaylistById(token, id));
      Promise.all(requests.map(obs => obs.toPromise())).then(results => {
        observer.next(results);
        observer.complete();
      });
    });
  }
  
}
