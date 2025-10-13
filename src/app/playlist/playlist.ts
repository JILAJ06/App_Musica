import { Component, input } from '@angular/core';
import { Song } from '../interfaces/song';

@Component({
  selector: 'app-playlist',
  standalone: false,
  templateUrl: './playlist.html',
  styleUrl: './playlist.css'
})
export class Playlist {

  playlist = input.required<Song[]>();

}
