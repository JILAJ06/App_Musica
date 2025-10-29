import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./components/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'track/:id',
    loadComponent: () => import('./components/track-detail/track-detail.component').then(m => m.TrackDetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
