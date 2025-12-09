import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { SpotifyService } from '../../core/services';
import { Track, AlbumItem, ArtistItem } from '../../core/models';
import { SEARCH_DEBOUNCE_TIME, PLACEHOLDER_IMAGE_URL, ERROR_MESSAGES } from '../../core/constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  
  currentTrack: Track | null = null;
  playlist: Track[] = [];

  isQueueVisible: boolean = true;

  searchQuery: string = '';
  isLoading: boolean = false;
  hasSearched: boolean = false;
  apiConnected: boolean = false;
  errorMessage: string = '';
  
  searchTracks: Track[] = [];
  searchAlbums: AlbumItem[] = [];
  searchArtists: ArtistItem[] = [];

  private searchSubject = new Subject<string>();

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeSubscriptions();
    this.setupSearchDebounce();
    this.checkApiConnection();
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  private initializeSubscriptions(): void {
    this.spotifyService.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });

    this.spotifyService.playlist$.subscribe(playlist => {
      this.playlist = playlist;
    });
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(SEARCH_DEBOUNCE_TIME),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm && searchTerm.trim().length > 0) {
        this.performSearch(searchTerm.trim());
      } else {
        this.clearSearchResults();
      }
    });
  }

  private checkApiConnection(): void {
    this.apiConnected = this.spotifyService.isReady();
  }

  /**
   * Maneja el evento de input en la barra de búsqueda
   * Emite el valor al subject para debounce automático
   */
  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  /**
   * Ejecuta la búsqueda en la API de Spotify
   * @param query Término de búsqueda
   */
  performSearch(query: string): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.spotifyService.searchAll(query).subscribe({
      next: (res) => {
        this.searchTracks = res.tracks || [];
        this.searchAlbums = res.albums || [];
        this.searchArtists = res.artists || [];
        this.hasSearched = true;
        this.isLoading = false;
        this.apiConnected = true;
      },
      error: (err) => {
        console.error('Search error', err);
        this.isLoading = false;
        this.hasSearched = true;
        this.apiConnected = this.spotifyService.isReady();
        this.handleSearchError(err);
      }
    });
  }

  /**
   * Maneja errores de búsqueda con mensajes apropiados
   * @param error Error de HTTP
   */
  private handleSearchError(error: any): void {
    if (error?.status === 401) {
      this.errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
    } else if (error?.status === 429) {
      this.errorMessage = ERROR_MESSAGES.RATE_LIMIT;
    } else {
      this.errorMessage = ERROR_MESSAGES.GENERIC;
    }
  }

  /**
   * Búsqueda manual con Enter (mantiene compatibilidad)
   */
  onSearch(): void {
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.performSearch(this.searchQuery.trim());
    }
  }

  /**
   * Limpia solo los resultados de búsqueda (mantiene query)
   */
  clearSearchResults(): void {
    this.hasSearched = false;
    this.searchTracks = [];
    this.searchAlbums = [];
    this.searchArtists = [];
    this.errorMessage = '';
  }

  /**
   * Limpia completamente la búsqueda (incluye query)
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.clearSearchResults();
  }

  // ===========================
  // Gestión de playlist
  // ===========================

  /**
   * Agrega una pista a la playlist
   * @param track Pista a agregar
   */
  addToPlaylist(track: Track): void {
    this.spotifyService.addToPlaylist(track);
  }

  /**
   * Elimina una pista de la playlist
   * @param trackId ID de la pista a eliminar
   */
  removeFromPlaylist(trackId: string): void {
    this.spotifyService.removeFromPlaylist(trackId);
  }

  /**
   * Selecciona una pista como actual y limpia búsqueda
   * @param track Pista seleccionada
   */
  selectTrack(track: Track): void {
    this.spotifyService.setCurrentTrack(track);
    this.clearSearch();
  }

  // ===========================
  // Métodos de utilidad
  // ===========================

  /**
   * Navega al detalle de un álbum
   * @param albumId ID del álbum
   */
  navigateToAlbum(albumId: string): void {
    this.router.navigate(['/album', albumId]);
  }

  /**
   * Navega al detalle de una canción
   * @param trackId ID de la canción
   */
  navigateToTrack(trackId: string): void {
    this.router.navigate(['/track', trackId]);
  }

  /**
   * Navega al perfil de un artista
   * @param artistId ID del artista
   */
  navigateToArtist(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  /**
   * Obtiene nombres de artistas formateados
   * @param item Track, Album o Artist
   * @returns String con nombres de artistas separados por coma
   */
  getArtistNames(item: Track | AlbumItem | ArtistItem): string {
    const artists = (item as any).artists;
    if (artists && Array.isArray(artists)) {
      return artists.map((a: any) => a.name).join(', ');
    }
    return (item as any).name || '';
  }

  /**
   * Obtiene URL de imagen del álbum o placeholder
   * @param item Track, Album o Artist
   * @returns URL de la imagen
   */
  getAlbumImage(item: Track | AlbumItem | ArtistItem): string {
    const images = (item as any)?.album?.images || (item as any)?.images || [];
    return (images && images.length > 0) ? images[0].url : PLACEHOLDER_IMAGE_URL;
  }

  /**
   * Formatea duración de milisegundos a M:SS
   * @param ms Duración en milisegundos
   * @returns String formateado (ej: "3:45")
   */
  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Extrae el año de una fecha en formato YYYY-MM-DD
   * @param dateString Fecha en formato ISO
   * @returns Año como string o vacío si no hay fecha
   */
  getYear(dateString?: string): string {
    if (!dateString) return '';
    return dateString.split('-')[0];
  }

  /**
   * Alterna la visibilidad de la cola de reproducción
   */
  toggleQueue(): void {
    this.isQueueVisible = !this.isQueueVisible;
  }

  /**
   * Formatea el tipo de álbum a mayúsculas
   * @param type Tipo de álbum (album, single, compilation)
   * @returns Tipo formateado en mayúsculas
   */
  getAlbumType(type?: string): string {
    if (!type) return 'ÁLBUM';
    return type.toUpperCase();
  }
}
