import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';

@Component({
  selector: 'app-bookmark-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div *ngFor="let bookmark of bookmarks" 
           class="notion-card group overflow-hidden flex flex-col">
        <div class="h-32 bg-neutral-100 dark:bg-neutral-700 relative">
          <img *ngIf="bookmark.screenshotUrl" [src]="bookmark.screenshotUrl" alt="Preview" class="w-full h-full object-cover">
          <div *ngIf="!bookmark.screenshotUrl" class="w-full h-full flex items-center justify-center">
            <div class="text-center p-4">
              <img *ngIf="bookmark.faviconUrl" [src]="bookmark.faviconUrl" alt="Favicon" class="h-10 w-10 mx-auto mb-2">
              <div *ngIf="!bookmark.faviconUrl" class="h-10 w-10 mx-auto mb-2 bg-neutral-200 dark:bg-neutral-600 rounded-full flex items-center justify-center text-xl">
                {{ bookmark.title.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button [class.text-amber-500]="bookmark.isFavorite" [class.text-white]="!bookmark.isFavorite" 
                    (click)="toggleFavorite(bookmark.id)" class="p-1 bg-neutral-800/70 rounded-full hover:bg-neutral-900/70">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" [class.fill-current]="bookmark.isFavorite" viewBox="0 0 24 24" stroke="currentColor" [class.stroke-0]="bookmark.isFavorite" [class.stroke-2]="!bookmark.isFavorite">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <button class="p-1 bg-neutral-800/70 rounded-full hover:bg-neutral-900/70 text-white" (click)="editBookmark(bookmark.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button class="p-1 bg-neutral-800/70 rounded-full hover:bg-neutral-900/70 text-white" (click)="deleteBookmark(bookmark.id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-center mb-2">
            <img *ngIf="bookmark.faviconUrl" [src]="bookmark.faviconUrl" alt="Favicon" class="h-4 w-4 mr-2">
            <div *ngIf="!bookmark.faviconUrl" class="h-4 w-4 mr-2 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-[8px]">
              {{ bookmark.title.charAt(0).toUpperCase() }}
            </div>
            <h3 class="font-medium text-sm truncate">
              <a [href]="bookmark.url" target="_blank" class="hover:text-primary-600 transition-colors">
                {{ bookmark.title }}
              </a>
            </h3>
          </div>
          <p *ngIf="bookmark.description" class="text-xs text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2">
            {{ bookmark.description }}
          </p>
          <div class="mt-auto">
            <div class="flex flex-wrap gap-1">
              <span *ngFor="let tag of bookmark.tags" 
                    class="px-1.5 py-0.5 text-xs rounded-full"
                    [style.backgroundColor]="tag.color + '33'"
                    [style.color]="tag.color">
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty state -->
      <div *ngIf="bookmarks.length === 0" class="col-span-full">
        <div class="text-center py-10 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p class="text-neutral-500 dark:text-neutral-400 mb-4">No bookmarks found</p>
          <button class="primary-button" (click)="addBookmark()">Add Bookmark</button>
        </div>
      </div>
    </div>
  `
})
export class BookmarkGridComponent implements OnInit {
  @Input() bookmarks: Bookmark[] = [];
  
  constructor(private bookmarkService: BookmarkService) {}
  
  ngOnInit(): void {}
  
  toggleFavorite(id: string): void {
    this.bookmarkService.toggleFavorite(id);
  }
  
  editBookmark(id: string): void {
    console.log('Edit bookmark', id);
    // This will be implemented to open edit dialog
  }
  
  deleteBookmark(id: string): void {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      this.bookmarkService.deleteBookmark(id);
    }
  }
  
  addBookmark(): void {
    console.log('Add bookmark');
    // This will be implemented to open add dialog
  }
}