import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkListComponent } from '../../components/bookmark-list/bookmark-list.component';
import { BookmarkGridComponent } from '../../components/bookmark-grid/bookmark-grid.component';
import { BookmarksExplorerComponent } from '../../components/bookmarks-explorer/bookmarks-explorer.component';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';

@Component({
  selector: 'app-all-bookmarks-page',
  standalone: true,
  imports: [CommonModule, BookmarkListComponent, BookmarkGridComponent, BookmarksExplorerComponent],
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
          <button (click)="setViewMode('explorer')" class="p-2 rounded-md" [class.bg-neutral-100]="currentViewMode === 'explorer'" [class.dark:bg-neutral-700]="currentViewMode === 'explorer'">
            <span class="sr-only">Explorer view</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      <ng-container [ngSwitch]="currentViewMode">
        <app-bookmark-list *ngSwitchCase="'list'" [bookmarks]="bookmarks"></app-bookmark-list>
        <app-bookmark-grid *ngSwitchCase="'grid'" [bookmarks]="bookmarks"></app-bookmark-grid>
        <app-bookmarks-explorer *ngSwitchCase="'explorer'"></app-bookmarks-explorer>
      </ng-container>
    </div>
  `
})
export class AllBookmarksPageComponent implements OnInit {
  currentViewMode = 'list';
  bookmarks: Bookmark[] = [];
  
  constructor(
    private viewModeService: ViewModeService,
    private bookmarkService: BookmarkService
  ) {
    this.viewModeService.currentViewMode$.subscribe(viewMode => {
      this.currentViewMode = viewMode;
    });
  }
  
  ngOnInit(): void {
    this.bookmarkService.getBookmarks().subscribe(bookmarks => {
      this.bookmarks = bookmarks;
    });
  }
  
  setViewMode(mode: string): void {
    this.viewModeService.setViewMode(mode);
  }
}