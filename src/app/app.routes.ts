import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'bookmarks',
    pathMatch: 'full'
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./features/bookmarks/pages/all-bookmarks-page/all-bookmarks-page.component').then(m => m.AllBookmarksPageComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/bookmarks/pages/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent)
  },
  {
    path: 'recent',
    loadComponent: () => import('./features/bookmarks/pages/recent-page/recent-page.component').then(m => m.RecentPageComponent)
  },
  {
    path: 'folder/:id',
    loadComponent: () => import('./features/bookmarks/pages/folder-page/folder-page.component').then(m => m.FolderPageComponent)
  },
  {
    path: 'tag/:id',
    loadComponent: () => import('./features/bookmarks/pages/tag-page/tag-page.component').then(m => m.TagPageComponent)
  },
  {
    path: '**',
    redirectTo: 'bookmarks'
  }
];