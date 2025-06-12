import { Routes } from '@angular/router';
import { GigsComponent } from './components/gigs/gigs.component';

export const routes: Routes = [
  { path: '', component: GigsComponent },
  {
    path: 'gigs/:id',
    loadComponent: () =>
      import('./components/gig-detail/gig-detail.component').then(
        m => m.GigDetailComponent
      )
  },
  {
    path: 'song/:id',
    loadComponent: () =>
      import('./components/song-detail/song-detail.component').then(
        m => m.SongDetailComponent
      )
  }
];
