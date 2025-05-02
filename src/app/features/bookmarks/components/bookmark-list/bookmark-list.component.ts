import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';
import { BookmarkItemComponent } from '../bookmark-item/bookmark-item.component';

@Component({
  selector: 'app-bookmark-list',
  standalone: true,
  imports: [CommonModule, BookmarkItemComponent],
  template: `
    <div class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead class="bg-neutral-50 dark:bg-neutral-900">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              URL
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Tags
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Added
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
          <tr *ngFor="let bookmark of bookmarks" class="hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img *ngIf="bookmark.faviconUrl" [src]="bookmark.faviconUrl" alt="Favicon" class="h-5 w-5 mr-3">
                <div *ngIf="!bookmark.faviconUrl" class="h-5 w-5 mr-3 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-xs">
                  {{ bookmark.title.charAt(0).toUpperCase() }}
                </div>
                <div class="text-sm font-medium">
                  <a [href]="bookmark.url" target="_blank" class="hover:text-primary-600 transition-colors">
                    {{ bookmark.title }}
                  </a>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                {{ bookmark.url }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let tag of bookmark.tags" 
                      class="px-2 py-1 text-xs rounded-full"
                      [style.backgroundColor]="tag.color + '33'"
                      [style.color]="tag.color">
                  {{ tag.name }}
                </span>
                <span *ngIf="!bookmark.tags || bookmark.tags.length === 0" class="text-sm text-neutral-400">—</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
              {{ bookmark.createdAt | date:'mediumDate' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button [class.text-amber-500]="bookmark.isFavorite" [class.text-neutral-400]="!bookmark.isFavorite" 
                      (click)="toggleFavorite(bookmark.id)" class="hover:text-amber-600 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [class.fill-current]="bookmark.isFavorite" viewBox="0 0 24 24" stroke="currentColor" [class.stroke-0]="bookmark.isFavorite" [class.stroke-2]="!bookmark.isFavorite">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 mr-3" (click)="editBookmark(bookmark.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button class="text-neutral-400 hover:text-error-600" (click)="deleteBookmark(bookmark.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
          
          <tr *ngIf="bookmarks.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
              <div class="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p>No bookmarks found</p>
                <button class="mt-2 primary-button" (click)="addBookmark()">Add Bookmark</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class BookmarkListComponent implements OnInit {
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