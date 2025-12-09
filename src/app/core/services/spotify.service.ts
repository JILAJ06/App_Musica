import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Track, AlbumItem, ArtistItem, AlbumDetail, ArtistDetail } from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para interactuar con la API de Spotify
 * Implementa autenticación Client Credentials Flow
 */
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  // ===========================
  // URLs de la API
  // ===========================
  private readonly apiUrl = 'https://api.spotify.com/v1';
  private readonly authUrl = 'https://accounts.spotify.com/api/token';
  
  // ===========================
  // Gestión de autenticación
  // ===========================
  private accessToken = '';
  private tokenExpiration = 0;
  
  // ===========================
  // Observables de estado
  // ===========================
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  public currentTrack$ = this.currentTrackSubject.asObservable();
  
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  public playlist$ = this.playlistSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeToken();
  }

  // ===========================
  // Métodos de autenticación
  // ===========================

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
   * Si el token aún es válido, no hace una nueva petición
   */
  private async getAccessToken(): Promise<void> {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return;
    }

    const body = new HttpParams().set('grant_type', 'client_credentials');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${environment.spotify.clientId}:${environment.spotify.clientSecret}`)
    });

    return new Promise((resolve, reject) => {
      this.http.post<any>(this.authUrl, body.toString(), { headers })
        .subscribe({
          next: (response) => {
            this.accessToken = response.access_token;
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

  /**
   * Genera los headers de autorización para peticiones a la API
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`
    });
  }

  // ===========================
  // Métodos de búsqueda
  // ===========================

  /**
   * Busca pistas en Spotify por query
   * @param query Término de búsqueda
   * @returns Observable con array de pistas encontradas
   */
  searchTracks(query: string): Observable<Track[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track')
      .set('limit', '20');

    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<{ tracks: { items: Track[] } }>(`${this.apiUrl}/search`, {
        headers: this.getHeaders(),
        params
      })),
      map(response => response.tracks.items)
    );
  }

  /**
   * Búsqueda completa: tracks, albums y artists
   * @param query Término de búsqueda
   * @returns Observable con objeto conteniendo arrays de tracks, albums y artists
   */
  searchAll(query: string): Observable<{ tracks: Track[]; albums: AlbumItem[]; artists: ArtistItem[] }> {
    const params = new HttpParams()
      .set('q', query)
      .set('type', 'track,album,artist')
      .set('limit', '20');

    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<any>(`${this.apiUrl}/search`, {
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

  /**
   * Obtiene información de una pista específica por ID
   * @param id ID de la pista en Spotify
   * @returns Observable con la información de la pista
   */
  getTrack(id: string): Observable<Track> {
    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<Track>(`${this.apiUrl}/tracks/${id}`, {
        headers: this.getHeaders()
      }))
    );
  }

  /**
   * Obtiene información completa de un álbum por ID
   * @param id ID del álbum en Spotify
   * @returns Observable con toda la información del álbum incluyendo pistas
   */
  getAlbum(id: string): Observable<AlbumDetail> {
    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<AlbumDetail>(`${this.apiUrl}/albums/${id}`, {
        headers: this.getHeaders()
      }))
    );
  }

  /**
   * Obtiene información completa de un artista por ID
   * @param id ID del artista en Spotify
   * @returns Observable con toda la información del artista
   */
  getArtist(id: string): Observable<ArtistDetail> {
    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<ArtistDetail>(`${this.apiUrl}/artists/${id}`, {
        headers: this.getHeaders()
      }))
    );
  }

  /**
   * Obtiene las canciones más populares de un artista
   * @param id ID del artista en Spotify
   * @param market Código de mercado (país) opcional, por defecto 'US'
   * @returns Observable con las top tracks del artista
   */
  getArtistTopTracks(id: string, market: string = 'US'): Observable<Track[]> {
    const params = new HttpParams().set('market', market);
    
    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<{ tracks: Track[] }>(`${this.apiUrl}/artists/${id}/top-tracks`, {
        headers: this.getHeaders(),
        params
      })),
      map(response => response.tracks)
    );
  }

  /**
   * Obtiene los álbumes de un artista
   * @param id ID del artista en Spotify
   * @param limit Número de álbumes a obtener (por defecto 20)
   * @returns Observable con los álbumes del artista
   */
  getArtistAlbums(id: string, limit: number = 20): Observable<AlbumItem[]> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('include_groups', 'album,single');
    
    return from(this.getAccessToken()).pipe(
      switchMap(() => this.http.get<{ items: AlbumItem[] }>(`${this.apiUrl}/artists/${id}/albums`, {
        headers: this.getHeaders(),
        params
      })),
      map(response => response.items)
    );
  }

  // ===========================
  // Gestión de playlist local
  // ===========================

  /**
   * Establece la pista actual y la agrega a la playlist
   * @param track Pista a establecer como actual
   */
  setCurrentTrack(track: Track): void {
    this.currentTrackSubject.next(track);
    this.addToPlaylist(track);
  }

  /**
   * Agrega una pista a la playlist (evita duplicados)
   * @param track Pista a agregar
   */
  addToPlaylist(track: Track): void {
    const currentPlaylist = this.playlistSubject.value;
    const exists = currentPlaylist.find(t => t.id === track.id);
    
    if (!exists) {
      this.playlistSubject.next([...currentPlaylist, track]);
    }
  }

  /**
   * Elimina una pista de la playlist por ID
   * @param trackId ID de la pista a eliminar
   */
  removeFromPlaylist(trackId: string): void {
    const currentPlaylist = this.playlistSubject.value;
    this.playlistSubject.next(currentPlaylist.filter(t => t.id !== trackId));
  }

  /**
   * Obtiene la pista actualmente reproduciendo (valor actual del BehaviorSubject)
   * @returns La pista actual o null si no hay ninguna
   */
  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  /**
   * Obtiene la playlist completa (valor actual del BehaviorSubject)
   * @returns Array con todas las pistas en la playlist
   */
  getPlaylist(): Track[] {
    return this.playlistSubject.value;
  }

  // ===========================
  // Métodos de utilidad
  // ===========================

  /**
   * Verifica si el servicio está listo para hacer peticiones
   * @returns true si hay un token válido, false en caso contrario
   */
  isReady(): boolean {
    return this.accessToken !== '' && Date.now() < this.tokenExpiration;
  }

  /**
   * Obtiene información del estado del token (útil para debugging)
   * @returns Objeto con información del token
   */
  getTokenInfo(): { hasToken: boolean; expiresIn: number } {
    return {
      hasToken: this.accessToken !== '',
      expiresIn: Math.max(0, Math.floor((this.tokenExpiration - Date.now()) / 1000))
    };
  }
}
