import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './player/player';
import { AudioController } from './audio-controller/audio-controller';

const routes: Routes = [
  {
    path: '',
    component:Player,
    title: 'Player Music'
  },
  {
    path:'controller',
    component: AudioController
  },
  {
    path:'view',
    loadChildren: () => import('./test/test-module').then(m => m.TestModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
