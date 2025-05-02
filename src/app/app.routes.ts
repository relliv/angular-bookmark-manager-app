import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'bookmarks',
    pathMatch: 'full'
  },
  {
    path: 'bookmarks',
    loadComponent: () => import('./features/bookmarks/pages/bookmarks-page/bookmarks-page.component').then(m => m.BookmarksPageComponent)
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