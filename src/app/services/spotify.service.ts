import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Track, SearchResponse, SearchAllResponse, AlbumItem, ArtistItem } from '../models/track.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private apiUrl = 'https://api.spotify.com/v1';
  private authUrl = 'https://accounts.spotify.com/api/token';
  
  // Token de acceso de Spotify
  private accessToken = '';
  private tokenExpiration = 0;
  
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  public currentTrack$ = this.currentTrackSubject.asObservable();
  
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  public playlist$ = this.playlistSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeToken();
  }

  /**
   * Inicializa el token usando Client Credentials Flow
   */
  private async initializeToken(): Promise<void> {
    try {
      await this.getAccessToken();
      console.log('✅ Token de Spotify obtenido correctamente');
    } catch (error) {
      console.error('❌ Error al obtener token de Spotify:', error);
    }
  }

  /**
   * Obtiene un access token usando Client Credentials Flow
   */
  private async getAccessToken(): Promise<void> {
    // Si el token aún es válido, no hacer nada
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return;
    }

    const body = new HttpParams()
      .set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${environment.spotify.clientId}:${environment.spotify.clientSecret}`)
    });

    return new Promise((resolve, reject) => {
      this.http.post<any>(this.authUrl, body.toString(), { headers })
        .subscribe({
          next: (response) => {
            this.accessToken = response.access_token;
            // El token expira en 3600 segundos (1 hora), guardamos cuando expira
            this.tokenExpiration = Date.now() + (response.expires_in * 1000);
            resolve();
          },
          error: (error) => {
            console.error('Error obteniendo token:', error);
            reject(error);
          }
        });
    });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  searchTracks(query: string): Observable<Track[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', '20');

    return this.http.get<SearchResponse>(`${this.apiUrl}/search`, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      map(response => response.tracks.items)
    );
  }

  /**
   * Búsqueda multi-tipo: tracks, albums y artists.
   * Devuelve un objeto con las tres colecciones (arrays).
   */
  searchAll(query: string): Observable<{ tracks: Track[]; albums: AlbumItem[]; artists: ArtistItem[] }> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track,album,artist')
      .set('limit', '20');

    // Asegurarse de tener token válido antes de la petición
    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<SearchAllResponse>(`${this.apiUrl}/search`, {
        headers: this.getHeaders(),
        params
      })),
      map(response => ({
        tracks: response.tracks?.items || [],
        albums: response.albums?.items || [],
        artists: response.artists?.items || []
      }))
    );
  }

  getTrack(id: string): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/tracks/${id}`, {
      headers: this.getHeaders()
    });
  }

  setCurrentTrack(track: Track): void {
    this.currentTrackSubject.next(track);
    this.addToPlaylist(track);
  }

  addToPlaylist(track: Track): void {
    const currentPlaylist = this.playlistSubject.value;
    const exists = currentPlaylist.find(t => t.id === track.id);
    
    if (!exists) {
      this.playlistSubject.next([...currentPlaylist, track]);
    }
  }

  removeFromPlaylist(trackId: string): void {
    const currentPlaylist = this.playlistSubject.value;
    this.playlistSubject.next(currentPlaylist.filter(t => t.id !== trackId));
  }

  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  getPlaylist(): Track[] {
    return this.playlistSubject.value;
  }

  /**
   * Verifica si el servicio está listo para hacer peticiones
   */
  isReady(): boolean {
    return this.accessToken !== '' && Date.now() < this.tokenExpiration;
  }

  /**
   * Obtiene información del token (útil para debugging)
   */
  getTokenInfo(): { hasToken: boolean; expiresIn: number } {
    return {
      hasToken: this.accessToken !== '',
      expiresIn: Math.max(0, Math.floor((this.tokenExpiration - Date.now()) / 1000))
    };
  }
}
