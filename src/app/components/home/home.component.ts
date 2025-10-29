import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Track, AlbumItem, ArtistItem } from '../../models/track.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  playlist: Track[] = [];

  // Search functionality
  searchQuery: string = '';
  isLoading: boolean = false;
  hasSearched: boolean = false;
  apiConnected: boolean = false;
  errorMessage: string = '';
  searchTracks: Track[] = [];
  searchAlbums: AlbumItem[] = [];
  searchArtists: ArtistItem[] = [];

  // Subject for search debounce
  private searchSubject = new Subject<string>();

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });

    this.spotifyService.playlist$.subscribe(playlist => {
      this.playlist = playlist;
    });

    this.apiConnected = this.spotifyService.isReady();

    // Setup search debounce - espera 500ms después de que el usuario deje de escribir
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm && searchTerm.trim().length > 0) {
        this.performSearch(searchTerm.trim());
      } else {
        this.clearSearchResults();
      }
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  onSearchInput(): void {
    // Emitir el valor al subject cuando el usuario escribe
    this.searchSubject.next(this.searchQuery);
  }

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
        if (err && err.status === 401) {
          this.errorMessage = 'Token expirado o no autorizado. Intenta recargar.';
        } else if (err && err.status === 429) {
          this.errorMessage = 'Limite de peticiones alcanzado. Intenta más tarde.';
        } else {
          this.errorMessage = 'Error al buscar. Revisa tu conexión.';
        }
      }
    });
  }

  onSearch(): void {
    // Este método se mantiene para búsqueda manual con Enter
    if (this.searchQuery && this.searchQuery.trim().length > 0) {
      this.performSearch(this.searchQuery.trim());
    }
  }

  clearSearchResults(): void {
    this.hasSearched = false;
    this.searchTracks = [];
    this.searchAlbums = [];
    this.searchArtists = [];
    this.errorMessage = '';
  }

  addToPlaylist(track: Track): void {
    this.spotifyService.addToPlaylist(track);
  }

  removeFromPlaylist(trackId: string): void {
    this.spotifyService.removeFromPlaylist(trackId);
  }

  selectTrack(track: Track): void {
    this.spotifyService.setCurrentTrack(track);
    // Clear search results after selecting
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.hasSearched = false;
    this.searchTracks = [];
    this.searchAlbums = [];
    this.searchArtists = [];
    this.errorMessage = '';
  }

  getArtistNames(track: Track | AlbumItem | ArtistItem): string {
    // @ts-ignore
    if ((track as any).artists && Array.isArray((track as any).artists)) {
      // @ts-ignore
      return (track as any).artists.map((a: any) => a.name).join(', ');
    }
    // @ts-ignore
    return (track as any).name || '';
  }

  getAlbumImage(track: Track | AlbumItem | ArtistItem): string {
    // @ts-ignore
    const maybeImages = (track as any)?.album?.images || (track as any)?.images || [];
    return (maybeImages && maybeImages.length > 0) ? maybeImages[0].url : 'https://via.placeholder.com/300';
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getYear(dateString?: string): string {
    if (!dateString) return '';
    return dateString.split('-')[0];
  }

  getAlbumType(type?: string): string {
    if (!type) return 'ÁLBUM';
    return type.toUpperCase();
  }
}
