import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyPlaylistService } from '../services/spotify-api/spotify-playlist-service';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist implements OnInit {
  playlists: any[] = [];
  selectedPlaylist: any = null;

  constructor(
    private route: ActivatedRoute,
    private spotifyPlaylistService: SpotifyPlaylistService
  ) {}

  ngOnInit(): void {
    // IDs de playlists públicas de ejemplo
    const playlistIds = [
      '37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits
      '37i9dQZF1DX0XUsuxWHRQd', // Hot Country
      '37i9dQZF1DX4JAvHpjipBk'  // Rock Classics
    ];
    // Token temporal, reemplaza por tu método de obtención
    const token = 'TU_TOKEN_SPOTIFY';
    this.spotifyPlaylistService.getPublicPlaylists(token, playlistIds).subscribe((playlists: any[]) => {
      this.playlists = playlists;
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.selectedPlaylist = playlists.find(p => p.id === params['id']);
        } else {
          this.selectedPlaylist = null;
        }
      });
    });
  }

  getArtists(item: any): string {
    return item.track.artists.map((a: any) => a.name).join(', ');
  }
}
