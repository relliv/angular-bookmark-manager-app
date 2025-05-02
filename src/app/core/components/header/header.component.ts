import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <h1 class="text-xl font-bold">Bookmark Manager</h1>
      </div>
      
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" (click)="toggleTheme()">
          <span *ngIf="isDarkMode; else lightIcon" class="sr-only">Switch to light mode</span>
          <ng-template #lightIcon>
            <span class="sr-only">Switch to dark mode</span>
          </ng-template>
          
          <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          
          <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <button class="primary-button flex items-center" (click)="openAddBookmarkDialog()">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Bookmark
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() addBookmark = new EventEmitter<void>();
  
  isDarkMode = false;
  
  constructor(private themeService: ThemeService) {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  openAddBookmarkDialog(): void {
    this.addBookmark.emit();
  }
}