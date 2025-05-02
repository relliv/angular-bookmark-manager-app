import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkListComponent } from '../../components/bookmark-list/bookmark-list.component';
import { BookmarkGridComponent } from '../../components/bookmark-grid/bookmark-grid.component';
import { ViewModeService } from '../../../../core/services/view-mode.service';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';

@Component({
  selector: 'app-recent-page',
  standalone: true,
  imports: [CommonModule, BookmarkListComponent, BookmarkGridComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Recent Bookmarks</h1>
      
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
      
      <div *ngIf="recentBookmarks.length === 0" class="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-neutral-500 dark:text-neutral-400 mb-4">No recent bookmarks</p>
        <button class="primary-button">Add Bookmark</button>
      </div>
      
      <ng-container *ngIf="recentBookmarks.length > 0" [ngSwitch]="currentViewMode">
        <app-bookmark-list *ngSwitchCase="'list'" [bookmarks]="recentBookmarks"></app-bookmark-list>
        <app-bookmark-grid *ngSwitchCase="'grid'" [bookmarks]="recentBookmarks"></app-bookmark-grid>
      </ng-container>
    </div>
  `
})
export class RecentPageComponent implements OnInit {
  currentViewMode = 'list';
  recentBookmarks: Bookmark[] = [];
  
  constructor(
    private viewModeService: ViewModeService,
    private bookmarkService: BookmarkService
  ) {
    this.viewModeService.currentViewMode$.subscribe(viewMode => {
      this.currentViewMode = viewMode;
    });
  }
  
  ngOnInit(): void {
    this.bookmarkService.getRecentBookmarks().subscribe(bookmarks => {
      this.recentBookmarks = bookmarks;
    });
  }
  
  setViewMode(mode: string): void {
    this.viewModeService.setViewMode(mode);
  }
}