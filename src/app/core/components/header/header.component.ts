import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { LucideAngularModule, BookmarkIcon, SunIcon, MoonIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <header class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-3 px-4 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <lucide-angular [img]="BookmarkIcon" class="h-8 w-8 text-primary-600"></lucide-angular>
        <h1 class="text-xl font-bold">Bookmark Manager</h1>
      </div>
      
      <div class="flex items-center space-x-2">
        <button class="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" (click)="toggleTheme()">
          <span *ngIf="isDarkMode; else lightIcon" class="sr-only">Switch to light mode</span>
          <ng-template #lightIcon>
            <span class="sr-only">Switch to dark mode</span>
          </ng-template>
          
          <lucide-angular *ngIf="isDarkMode" [img]="SunIcon" class="h-5 w-5"></lucide-angular>
          <lucide-angular *ngIf="!isDarkMode" [img]="MoonIcon" class="h-5 w-5"></lucide-angular>
        </button>
        
        <button class="primary-button flex items-center" (click)="openAddBookmarkDialog()">
          <lucide-angular [img]="PlusIcon" class="h-4 w-4 mr-1"></lucide-angular>
          Add Bookmark
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() addBookmark = new EventEmitter<void>();
  
  isDarkMode = false;
  
  readonly BookmarkIcon = BookmarkIcon;
  readonly SunIcon = SunIcon;
  readonly MoonIcon = MoonIcon;
  readonly PlusIcon = PlusIcon;
  
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