import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.css'
})
export class TrackDetailComponent implements OnInit {
  track: Track | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const trackId = params['id'];
      if (trackId) {
        this.loadTrack(trackId);
      }
    });
  }

  loadTrack(id: string): void {
    this.isLoading = true;
    this.spotifyService.getTrack(id).subscribe({
      next: (track) => {
        this.track = track;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading track:', error);
        this.isLoading = false;
      }
    });
  }

  playTrack(): void {
    if (this.track) {
      this.spotifyService.setCurrentTrack(this.track);
      this.router.navigate(['/']);
    }
  }

  getArtistNames(): string {
    if (!this.track) return '';
    return this.track.artists.map(artist => artist.name).join(', ');
  }

  getAlbumImage(): string {
    if (!this.track) return 'https://via.placeholder.com/300';
    return this.track.album.images[0]?.url || 'https://via.placeholder.com/300';
  }
}
