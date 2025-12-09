import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'album/:id',
    loadComponent: () => import('./components/album-detail/album-detail.component').then(m => m.AlbumDetailComponent)
  },
  {
    path: 'track/:id',
    loadComponent: () => import('./components/track-detail/track-detail.component').then(m => m.TrackDetailComponent)
  },
  {
    path: 'artist/:id',
    loadComponent: () => import('./components/artist-detail/artist-detail.component').then(m => m.ArtistDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
