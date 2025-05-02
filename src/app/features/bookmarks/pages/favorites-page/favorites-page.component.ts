import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkListComponent } from '../../components/bookmark-list/bookmark-list.component';
import { BookmarkGridComponent } from '../../components/bookmark-grid/bookmark-grid.component';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, BookmarkListComponent, BookmarkGridComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="mb-4 flex justify-end">
        <div class="flex space-x-2 bg-white dark:bg-neutral-800 rounded-md shadow-sm p-1">
          <button (click)="setViewMode('list')" class="p-2 rounded-md" [class.bg-neutral-100]="currentViewMode === 'list'" [class.dark:bg-neutral-700]="currentViewMode === 'list'">
            <span class="sr-only">List view</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button (click)="setViewMode('grid')" class="p-2 rounded-md" [class.bg-neutral-100]="currentViewMode === 'grid'" [class.dark:bg-neutral-700]="currentViewMode === 'grid'">
            <span class="sr-only">Grid view</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div *ngIf="favoriteBookmarks.length === 0" class="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <p class="text-neutral-500 dark:text-neutral-400 mb-4">No favorite bookmarks yet</p>
        <button class="primary-button">Add to Favorites</button>
      </div>
      
      <ng-container *ngIf="favoriteBookmarks.length > 0" [ngSwitch]="currentViewMode">
        <app-bookmark-list *ngSwitchCase="'list'" [bookmarks]="favoriteBookmarks"></app-bookmark-list>
        <app-bookmark-grid *ngSwitchCase="'grid'" [bookmarks]="favoriteBookmarks"></app-bookmark-grid>
      </ng-container>
    </div>
  `
})
export class FavoritesPageComponent implements OnInit {
  currentViewMode = 'list';
  favoriteBookmarks: Bookmark[] = [];
  
  constructor(
    private viewModeService: ViewModeService,
    private bookmarkService: BookmarkService
  ) {
    this.viewModeService.currentViewMode$.subscribe(viewMode => {
      this.currentViewMode = viewMode;
    });
  }
  
  ngOnInit(): void {
    this.bookmarkService.getFavorites().subscribe(bookmarks => {
      this.favoriteBookmarks = bookmarks;
    });
  }
  
  setViewMode(mode: string): void {
    this.viewModeService.setViewMode(mode);
  }
}