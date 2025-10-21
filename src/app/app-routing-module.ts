import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './player/player';
import { AudioController } from './audio-controller/audio-controller';
import { Playlist } from './playlist/playlist';
import { SongInfo } from './song-info/song-info';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'playlists',
    pathMatch: 'full'
  },
  {
    path: 'playlists',
    component: Playlist,
    title: 'Playlists públicas'
  },
  {
    path: 'playlist/:id',
    component: Playlist,
    title: 'Playlist'
  },
  {
    path: 'song/:id',
    component: SongInfo,
    title: 'Canción'
  },
  {
    path: 'player',
    component: Player,
    title: 'Reproductor'
  },
  {
    path: 'controller',
    component: AudioController
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
