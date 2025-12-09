import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../core/services/spotify.service';
import { ArtistDetail } from '../../core/models/artist.model';
import { Track } from '../../core/models/track.model';
import { AlbumItem } from '../../core/models/album.model';
import { PLACEHOLDER_IMAGE_URL } from '../../core/constants/app.constants';

/**
 * Componente para mostrar el perfil detallado de un artista
 * Incluye información del artista, canciones populares y álbumes
 */
@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css']
})
export class ArtistDetailComponent implements OnInit {
  /** Información detallada del artista */
  artist: ArtistDetail | null = null;
  
  /** Top tracks del artista */
  topTracks: Track[] = [];
  
  /** Álbumes del artista */
  albums: AlbumItem[] = [];
  
  /** Estado de carga */
  loading = true;
  
  /** Estado de error */
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    const artistId = this.route.snapshot.paramMap.get('id');
    if (artistId) {
      this.loadArtistData(artistId);
    } else {
      this.error = 'ID de artista no válido';
      this.loading = false;
    }
  }

  /**
   * Carga todos los datos del artista (detalles, top tracks, álbumes)
   */
  private loadArtistData(artistId: string): void {
    this.loading = true;
    this.error = '';

    // Cargar detalles del artista
    this.spotifyService.getArtist(artistId).subscribe({
      next: (artist) => {
        this.artist = artist;
        // Cargar top tracks y álbumes en paralelo
        this.loadTopTracks(artistId);
        this.loadAlbums(artistId);
      },
      error: (err) => {
        console.error('Error al cargar artista:', err);
        this.error = 'No se pudo cargar la información del artista';
        this.loading = false;
      }
    });
  }

  /**
   * Carga las canciones más populares del artista
   */
  private loadTopTracks(artistId: string): void {
    this.spotifyService.getArtistTopTracks(artistId).subscribe({
      next: (tracks) => {
        this.topTracks = tracks;
      },
      error: (err) => {
        console.error('Error al cargar top tracks:', err);
      }
    });
  }

  /**
   * Carga los álbumes del artista
   */
  private loadAlbums(artistId: string): void {
    this.spotifyService.getArtistAlbums(artistId).subscribe({
      next: (albums) => {
        this.albums = albums;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar álbumes:', err);
        this.loading = false;
      }
    });
  }

  /**
   * Reproduce una canción y redirige al reproductor
   */
  playTrack(track: Track): void {
    this.spotifyService.addToPlaylist(track);
    this.spotifyService.setCurrentTrack(track);
    this.router.navigate(['/']);
  }

  /**
   * Navega al detalle de un álbum
   */
  goToAlbum(albumId: string): void {
    this.router.navigate(['/album', albumId]);
  }

  /**
   * Navega al detalle de una canción
   */
  goToTrack(trackId: string): void {
    this.router.navigate(['/track', trackId]);
  }

  /**
   * Vuelve a la página anterior
   */
  goBack(): void {
    this.router.navigate(['/']);
  }

  /**
   * Obtiene la imagen del artista
   */
  getArtistImage(): string {
    return this.artist?.images && this.artist.images.length > 0
      ? this.artist.images[0].url
      : PLACEHOLDER_IMAGE_URL;
  }

  /**
   * Obtiene la imagen de un álbum
   */
  getAlbumImage(album: AlbumItem): string {
    return album.images && album.images.length > 0
      ? album.images[0].url
      : PLACEHOLDER_IMAGE_URL;
  }

  /**
   * Obtiene la imagen de una canción
   */
  getTrackImage(track: Track): string {
    return track.album?.images && track.album.images.length > 0
      ? track.album.images[0].url
      : PLACEHOLDER_IMAGE_URL;
  }

  /**
   * Formatea la duración en milisegundos a formato MM:SS
   */
  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Formatea el número de seguidores
   */
  formatFollowers(followers: number): string {
    if (followers >= 1000000) {
      return (followers / 1000000).toFixed(1) + 'M';
    } else if (followers >= 1000) {
      return (followers / 1000).toFixed(1) + 'K';
    }
    return followers.toString();
  }

  /**
   * Obtiene el año de lanzamiento de un álbum
   */
  getAlbumYear(releaseDate: string): string {
    return releaseDate.split('-')[0];
  }

  /**
   * Obtiene el tipo de álbum formateado
   */
  getAlbumType(type: string): string {
    const types: { [key: string]: string } = {
      'album': 'Álbum',
      'single': 'Sencillo',
      'compilation': 'Compilación'
    };
    return types[type] || type;
  }

  /**
   * Reintentar carga de datos
   */
  retry(): void {
    const artistId = this.route.snapshot.paramMap.get('id');
    if (artistId) {
      this.loadArtistData(artistId);
    }
  }
}
