import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { ThemeService } from './core/services/theme.service';
import { BookmarkListComponent } from './features/bookmarks/components/bookmark-list/bookmark-list.component';
import { BookmarkGridComponent } from './features/bookmarks/components/bookmark-grid/bookmark-grid.component';
import { BookmarksExplorerComponent } from './features/bookmarks/components/bookmarks-explorer/bookmarks-explorer.component';
import { BookmarkService } from './features/bookmarks/services/bookmark.service';
import { ViewModeService } from './core/services/view-mode.service';
import { SearchBarComponent } from './core/components/search-bar/search-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BookmarkListComponent,
    BookmarkGridComponent,
    BookmarksExplorerComponent,
    SearchBarComponent
  ],
  providers: [ThemeService, ViewModeService, BookmarkService],
  template: `
    <div class="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      <app-header></app-header>
      <div class="flex flex-1 overflow-hidden">
        <app-sidebar></app-sidebar>
        <main class="flex-1 overflow-auto p-4">
          <div class="max-w-7xl mx-auto">
            <app-search-bar class="mb-4"></app-search-bar>
            <div class="mb-4 flex items-center justify-between">
              <h1 class="text-2xl font-semibold">{{ currentViewTitle }}</h1>
              <div class="flex space-x-2">
                <button (click)="setViewMode('list')" class="p-2 rounded-md" [class.bg-neutral-200]="currentViewMode === 'list'" [class.dark:bg-neutral-700]="currentViewMode === 'list'">
                  <span class="sr-only">List view</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button (click)="setViewMode('grid')" class="p-2 rounded-md" [class.bg-neutral-200]="currentViewMode === 'grid'" [class.dark:bg-neutral-700]="currentViewMode === 'grid'">
                  <span class="sr-only">Grid view</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button (click)="setViewMode('explorer')" class="p-2 rounded-md" [class.bg-neutral-200]="currentViewMode === 'explorer'" [class.dark:bg-neutral-700]="currentViewMode === 'explorer'">
                  <span class="sr-only">Explorer view</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <ng-container [ngSwitch]="currentViewMode">
              <app-bookmark-list *ngSwitchCase="'list'" class="animate-fade-in"></app-bookmark-list>
              <app-bookmark-grid *ngSwitchCase="'grid'" class="animate-fade-in"></app-bookmark-grid>
              <app-bookmarks-explorer *ngSwitchCase="'explorer'" class="animate-fade-in"></app-bookmarks-explorer>
            </ng-container>
          </div>
        </main>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  @HostBinding('class.dark') isDarkMode = false;
  
  currentViewMode = 'list';
  currentViewTitle = 'All Bookmarks';

  constructor(
    private themeService: ThemeService,
    private viewModeService: ViewModeService
  ) {}

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    this.viewModeService.currentViewMode$.subscribe(viewMode => {
      this.currentViewMode = viewMode;
    });
  }

  setViewMode(mode: string): void {
    this.viewModeService.setViewMode(mode);
  }
}