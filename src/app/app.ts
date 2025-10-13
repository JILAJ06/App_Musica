import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MusicPlayerService, Song } from './player/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  // Exponemos los Observables del servicio a la plantilla
  songs$: Observable<Song[]>;
  currentSong$: Observable<Song | null>;
  isPlaying$: Observable<boolean>;
  currentTime$: Observable<number>;
  duration$: Observable<number>;

  constructor(private musicPlayerService: MusicPlayerService) {
    this.songs$ = this.musicPlayerService.getSongList();
    this.currentSong$ = this.musicPlayerService.getCurrentSong();
    this.isPlaying$ = this.musicPlayerService.getIsPlaying();
    this.currentTime$ = this.musicPlayerService.getCurrentTime();
    this.duration$ = this.musicPlayerService.getDuration();
  }
  
  // Métodos que la plantilla llamará
  togglePlayPause() {
    this.musicPlayerService.togglePlayPause();
  }

  playSong(song: Song) {
    this.musicPlayerService.playSong(song);
  }

  seekTo(event: MouseEvent) {
    this.musicPlayerService.seekTo(event);
  }

  // Función de utilidad para formatear el tiempo
  formatTime(seconds: number | null): string {
    if (seconds === null || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
