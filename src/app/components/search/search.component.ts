import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { Track, AlbumItem, ArtistItem } from '../../models/track.model';

@Component({
	selector: 'app-search',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterLink],
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	searchQuery: string = '';
	isLoading: boolean = false;
	hasSearched: boolean = false;
	apiConnected: boolean = false;
	errorMessage: string = '';

	searchTracks: Track[] = [];
	searchAlbums: AlbumItem[] = [];
	searchArtists: ArtistItem[] = [];

	constructor(
		private spotifyService: SpotifyService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.apiConnected = this.spotifyService.isReady();
	}

	onSearch(): void {
		this.errorMessage = '';
		if (!this.searchQuery || this.searchQuery.trim().length === 0) {
			this.errorMessage = 'Escribe algo para buscar.';
			return;
		}

		this.isLoading = true;
		this.hasSearched = false;

		this.spotifyService.searchAll(this.searchQuery.trim()).subscribe({
			next: (res) => {
				this.searchTracks = res.tracks || [];
				this.searchAlbums = res.albums || [];
				this.searchArtists = res.artists || [];
				this.hasSearched = true;
				this.isLoading = false;
				this.apiConnected = true;
			},
			error: (err) => {
				console.error('Search error', err);
				this.isLoading = false;
				this.hasSearched = true;
				this.apiConnected = this.spotifyService.isReady();
				if (err && err.status === 401) {
					this.errorMessage = 'Token expirado o no autorizado. Intenta recargar.';
				} else if (err && err.status === 429) {
					this.errorMessage = 'Limite de peticiones alcanzado. Intenta más tarde.';
				} else {
					this.errorMessage = 'Error al buscar. Revisa tu conexión.';
				}
			}
		});
	}

	selectTrack(track: Track): void {
		this.spotifyService.setCurrentTrack(track);
		// Si existe una vista principal, navegar a ella
		this.router.navigate(['/']);
	}

		getAlbumImage(item: Track | AlbumItem | ArtistItem): string {
			// Track -> album.images, AlbumItem -> images, ArtistItem -> images?
			// @ts-ignore - flexible access to different shapes
			const maybeImages = (item as any)?.album?.images || (item as any)?.images || [];
			return (maybeImages && maybeImages.length > 0) ? maybeImages[0].url : 'https://via.placeholder.com/300';
		}

	getArtistNames(track: Track | AlbumItem | ArtistItem): string {
		// Track tiene artists, AlbumItem tiene artists, ArtistItem solo nombre
		// @ts-ignore
		if ((track as any).artists && Array.isArray((track as any).artists)) {
			// @ts-ignore
			return (track as any).artists.map((a: any) => a.name).join(', ');
		}
		// @ts-ignore
		return (track as any).name || '';
	}
}
