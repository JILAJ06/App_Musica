import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../core/services';
import { AlbumDetail, AlbumTrack } from '../../core/models';
import { PLACEHOLDER_IMAGE_URL } from '../../core/constants';

/**
 * Componente de detalle de álbum
 * Muestra información completa del álbum y su tracklist
 */
@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {
  album: AlbumDetail | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    const albumId = this.route.snapshot.paramMap.get('id');
    if (albumId) {
      this.loadAlbumDetails(albumId);
    } else {
      this.errorMessage = 'ID de álbum no válido';
      this.isLoading = false;
    }
  }

  private loadAlbumDetails(albumId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.spotifyService.getAlbum(albumId).subscribe({
      next: (album) => {
        this.album = album;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading album:', error);
        this.errorMessage = 'Error al cargar el álbum. Por favor intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  playTrack(track: AlbumTrack): void {
    if (this.album) {

      const fullTrack = {
        id: track.id,
        name: track.name,
        artists: track.artists,
        duration_ms: track.duration_ms,
        preview_url: track.preview_url,
        album: {
          id: this.album.id,
          name: this.album.name,
          images: this.album.images,
          album_type: this.album.album_type,
          release_date: this.album.release_date,
          total_tracks: this.album.total_tracks
        }
      };

      this.spotifyService.addToPlaylist(fullTrack);
      this.spotifyService.setCurrentTrack(fullTrack);
     
      this.router.navigate(['/']);
    }
  }

  goToArtist(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getAlbumImage(): string {
    return this.album?.images && this.album.images.length > 0
      ? this.album.images[0].url
      : PLACEHOLDER_IMAGE_URL;
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getYear(): string {
    if (!this.album?.release_date) return '';
    return this.album.release_date.split('-')[0];
  }

  getTotalDuration(): string {
    if (!this.album?.tracks?.items) return '0:00';
    
    const totalMs = this.album.tracks.items.reduce((sum, track) => sum + track.duration_ms, 0);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} h ${mins} min`;
    }
    
    return `${minutes} min ${seconds} s`;
  }

  getArtistNames(): string {
    return this.album?.artists?.map(a => a.name).join(', ') || '';
  }
}
