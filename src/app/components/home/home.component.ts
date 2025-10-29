import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Track } from '../../models/track.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  currentTrack: Track | null = null;
  playlist: Track[] = [];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });

    this.spotifyService.playlist$.subscribe(playlist => {
      this.playlist = playlist;
    });
  }

  removeFromPlaylist(trackId: string): void {
    this.spotifyService.removeFromPlaylist(trackId);
  }

  selectTrack(track: Track): void {
    this.spotifyService.setCurrentTrack(track);
  }

  getArtistNames(track: Track): string {
    return track.artists.map(artist => artist.name).join(', ');
  }

  getAlbumImage(track: Track): string {
    return track.album.images[0]?.url || 'https://via.placeholder.com/300';
  }
}
