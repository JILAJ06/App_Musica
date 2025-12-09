import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../core/services';
import { Track } from '../../core/models';
import { PLACEHOLDER_IMAGE_URL } from '../../core/constants';


/** * Componente de detalle de canción
 * Muestra información completa de la canción y permite reproducirla
 */ 
@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-detail.component.html',
  styleUrls: ['./track-detail.component.css']
})

export class TrackDetailComponent implements OnInit {
  track: Track | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    const trackId = this.route.snapshot.paramMap.get('id');
    if (trackId) {
      this.loadTrackDetails(trackId);
    } else {
      this.errorMessage = 'ID de canción no válido';
      this.isLoading = false;
    }
  }

  private loadTrackDetails(trackId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.spotifyService.getTrack(trackId).subscribe({
      next: (track) => {
        this.track = track;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading track:', error);
        this.errorMessage = 'Error al cargar la canción. Por favor intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  playTrack(): void {
    if (this.track) {
      this.spotifyService.addToPlaylist(this.track);
      this.spotifyService.setCurrentTrack(this.track);
      this.router.navigate(['/']);
    }
  }

  goToAlbum(): void {
    if (this.track?.album) {
      this.router.navigate(['/album', this.track.album.id]);
    }
  }

  goToArtist(artistId: string): void {
    this.router.navigate(['/artist', artistId]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getTrackImage(): string {
    return this.track?.album?.images && this.track.album.images.length > 0
      ? this.track.album.images[0].url
      : PLACEHOLDER_IMAGE_URL;
  }

  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getYear(): string {
    if (!this.track?.album?.release_date) return '';
    return this.track.album.release_date.split('-')[0];
  }

  getArtistNames(): string {
    return this.track?.artists?.map(a => a.name).join(', ') || '';
  }
}
