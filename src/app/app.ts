import { Component, OnInit, signal } from '@angular/core';
import { SpotifyLoginService } from './services/spotify-api/spotify-login-service';
import { SpotifyPlaylistService } from './services/spotify-api/spotify-playlist-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('EXAMPLE_APP');

  constructor(
    private _spotifyLoginService: SpotifyLoginService,
    private _sporifyPlaylistService: SpotifyPlaylistService
  ) {}


  ngOnInit(): void {
    this._spotifyLoginService.getToken().subscribe((data) => {
      this._sporifyPlaylistService.getPlaylist(data.access_token).subscribe(
        (data2) => {
          console.log(data2)
        }
      )
    });
    console.log("ESTE ES UN LOG DE CONTROL")
  }

}
