import { Injectable } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { Track } from '../models/track.model';

/**
 * Servicio de demostración con datos simulados
 * Úsalo si no tienes token de Spotify disponible
 * 
 * Para usar este servicio:
 * 1. Renombra spotify.service.ts a spotify.service.backup.ts
 * 2. Renombra este archivo a spotify.service.ts
 */

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private mockTracks: Track[] = [
    {
      id: '1',
      name: 'Blinding Lights',
      artists: [{ id: 'a1', name: 'The Weeknd' }],
      album: {
        id: 'alb1',
        name: 'After Hours',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36', height: 640, width: 640 }]
      },
      duration_ms: 200040,
      preview_url: null
    },
    {
      id: '2',
      name: 'Shape of You',
      artists: [{ id: 'a2', name: 'Ed Sheeran' }],
      album: {
        id: 'alb2',
        name: '÷ (Divide)',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96', height: 640, width: 640 }]
      },
      duration_ms: 233713,
      preview_url: null
    },
    {
      id: '3',
      name: 'Levitating',
      artists: [{ id: 'a3', name: 'Dua Lipa' }],
      album: {
        id: 'alb3',
        name: 'Future Nostalgia',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b', height: 640, width: 640 }]
      },
      duration_ms: 203064,
      preview_url: null
    },
    {
      id: '4',
      name: 'Someone You Loved',
      artists: [{ id: 'a4', name: 'Lewis Capaldi' }],
      album: {
        id: 'alb4',
        name: 'Divinely Uninspired To A Hellish Extent',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2734293385d324db8558c8c2cea', height: 640, width: 640 }]
      },
      duration_ms: 182160,
      preview_url: null
    },
    {
      id: '5',
      name: 'Bad Guy',
      artists: [{ id: 'a5', name: 'Billie Eilish' }],
      album: {
        id: 'alb5',
        name: 'WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b27350a3147b4edd7701a876c6ce', height: 640, width: 640 }]
      },
      duration_ms: 194088,
      preview_url: null
    },
    {
      id: '6',
      name: 'Bohemian Rhapsody',
      artists: [{ id: 'a6', name: 'Queen' }],
      album: {
        id: 'alb6',
        name: 'A Night At The Opera',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2731b169c1e1c68c14f3b67e2c7', height: 640, width: 640 }]
      },
      duration_ms: 354320,
      preview_url: null
    },
    {
      id: '7',
      name: 'Watermelon Sugar',
      artists: [{ id: 'a7', name: 'Harry Styles' }],
      album: {
        id: 'alb7',
        name: 'Fine Line',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273277b3180f3e68e9f36c0bc77', height: 640, width: 640 }]
      },
      duration_ms: 174000,
      preview_url: null
    },
    {
      id: '8',
      name: 'Starboy',
      artists: [
        { id: 'a1', name: 'The Weeknd' },
        { id: 'a8', name: 'Daft Punk' }
      ],
      album: {
        id: 'alb8',
        name: 'Starboy',
        images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452', height: 640, width: 640 }]
      },
      duration_ms: 230453,
      preview_url: null
    }
  ];

  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  public currentTrack$ = this.currentTrackSubject.asObservable();
  
  private playlistSubject = new BehaviorSubject<Track[]>([]);
  public playlist$ = this.playlistSubject.asObservable();

  constructor() {
    console.warn('⚠️ Usando servicio de DEMO con datos simulados');
    console.info('Para usar datos reales de Spotify, configura el token en spotify.service.ts');
  }

  searchTracks(query: string): Observable<Track[]> {
    // Simular búsqueda filtrando por nombre o artista
    const results = this.mockTracks.filter(track => 
      track.name.toLowerCase().includes(query.toLowerCase()) ||
      track.artists.some(artist => artist.name.toLowerCase().includes(query.toLowerCase())) ||
      track.album.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Simular delay de red
    return of(results).pipe(delay(500));
  }

  getTrack(id: string): Observable<Track> {
    const track = this.mockTracks.find(t => t.id === id);
    if (!track) {
      throw new Error('Track not found');
    }
    return of(track).pipe(delay(300));
  }

  setCurrentTrack(track: Track): void {
    this.currentTrackSubject.next(track);
    this.addToPlaylist(track);
  }

  addToPlaylist(track: Track): void {
    const currentPlaylist = this.playlistSubject.value;
    const exists = currentPlaylist.find(t => t.id === track.id);
    
    if (!exists) {
      this.playlistSubject.next([...currentPlaylist, track]);
    }
  }

  removeFromPlaylist(trackId: string): void {
    const currentPlaylist = this.playlistSubject.value;
    this.playlistSubject.next(currentPlaylist.filter(t => t.id !== trackId));
  }

  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  getPlaylist(): Track[] {
    return this.playlistSubject.value;
  }
}
