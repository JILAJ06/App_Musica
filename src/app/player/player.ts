import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Definimos una interfaz para tipificar nuestras canciones
export interface Song {
  title: string;
  artist: string;
  artwork: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class MusicPlayerService {
  private audio = new Audio();

  // --- FUENTE DE DATOS ---
  private songs: Song[] = [
    {
        title: "RENATA",
        artist: "DAAZ, Los Esquivel, Sebastian Esquivel",
        artwork: "https://i.scdn.co/image/ab67616d0000b273e0c352cd92376899557a5840",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
        title: "Na De Na",
        artist: "Angel Dior, Crissin",
        artwork: "https://i.scdn.co/image/ab67616d00004851212e379c6e78f2caf1856763",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
        title: "La Carretara",
        artist: "Prince Royce",
        artwork: "https://i.scdn.co/image/ab67616d000048514e8685b0d0c644c35e4d6a6a",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    }
  ];

  // --- ESTADO REACTIVO (Observables) ---
  // Usamos BehaviorSubject para que los componentes siempre reciban el último valor al suscribirse.
  private songList$ = new BehaviorSubject<Song[]>(this.songs);
  private currentSong$ = new BehaviorSubject<Song | null>(null);
  private isPlaying$ = new BehaviorSubject<boolean>(false);
  private currentTime$ = new BehaviorSubject<number>(0);
  private duration$ = new BehaviorSubject<number>(0);

  constructor() {
    this.loadSong(0); // Carga la primera canción al iniciar
    this.addAudioListeners();
  }

  // --- MÉTODOS PÚBLICOS PARA EXPONER EL ESTADO (como Observables) ---
  getSongList() { return this.songList$.asObservable(); }
  getCurrentSong() { return this.currentSong$.asObservable(); }
  getIsPlaying() { return this.isPlaying$.asObservable(); }
  getCurrentTime() { return this.currentTime$.asObservable(); }
  getDuration() { return this.duration$.asObservable(); }

  // --- LÓGICA DEL REPRODUCTOR ---

  loadSong(index: number) {
    const song = this.songs[index];
    if (song) {
      this.audio.src = song.url;
      this.audio.load(); // Es buena práctica llamar a load()
      this.currentSong$.next(song);
    }
  }

  playSong(song?: Song) {
    if (song && song !== this.currentSong$.value) {
      const index = this.songs.findIndex(s => s.url === song.url);
      this.loadSong(index);
    }
    this.audio.play();
    this.isPlaying$.next(true);
  }

  pauseSong() {
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  togglePlayPause() {
    if (this.isPlaying$.value) {
      this.pauseSong();
    } else {
      this.playSong(this.currentSong$.value!);
    }
  }
  
  seekTo(event: MouseEvent) {
    const progressBar = event.target as HTMLElement;
    const width = progressBar.clientWidth;
    const clickX = event.offsetX;
    const duration = this.audio.duration;
    
    if (duration) {
      this.audio.currentTime = (clickX / width) * duration;
    }
  }

  // --- LISTENERS DEL ELEMENTO AUDIO ---
  private addAudioListeners() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime$.next(this.audio.currentTime);
    });

    this.audio.addEventListener('durationchange', () => {
      this.duration$.next(this.audio.duration);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying$.next(false);
      // Opcional: pasar a la siguiente canción
      // this.nextSong();
    });
  }
}
