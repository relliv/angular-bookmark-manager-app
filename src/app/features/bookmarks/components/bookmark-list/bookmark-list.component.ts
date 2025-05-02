import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';
import { BookmarkItemComponent } from '../bookmark-item/bookmark-item.component';
import { LucideAngularModule, StarIcon, PencilIcon, TrashIcon, PlusIcon, BookmarkIcon } from 'lucide-angular';

@Component({
  selector: 'app-bookmark-list',
  standalone: true,
  imports: [CommonModule, BookmarkItemComponent, LucideAngularModule],
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
                <lucide-angular [img]="StarIcon" class="h-5 w-5" [class.fill-current]="bookmark.isFavorite"></lucide-angular>
              </button>
              <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 mr-3" (click)="editBookmark(bookmark)">
                <lucide-angular [img]="PencilIcon" class="h-5 w-5"></lucide-angular>
              </button>
              <button class="text-neutral-400 hover:text-error-600" (click)="deleteBookmark(bookmark.id)">
                <lucide-angular [img]="TrashIcon" class="h-5 w-5"></lucide-angular>
              </button>
            </td>
          </tr>
          
          <tr *ngIf="bookmarks.length === 0">
            <td colspan="5" class="px-6 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
              <div class="flex flex-col items-center">
                <lucide-angular [img]="BookmarkIcon" class="h-12 w-12 text-neutral-300 dark:text-neutral-600 mb-4"></lucide-angular>
                <p>No bookmarks found</p>
                <button class="mt-2 primary-button flex items-center" (click)="addBookmark()">
                  <lucide-angular [img]="PlusIcon" class="h-4 w-4 mr-1"></lucide-angular>
                  Add Bookmark
                </button>
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
  
  readonly StarIcon = StarIcon;
  readonly PencilIcon = PencilIcon;
  readonly TrashIcon = TrashIcon;
  readonly PlusIcon = PlusIcon;
  readonly BookmarkIcon = BookmarkIcon;
  
  constructor(private bookmarkService: BookmarkService) {}
  
  ngOnInit(): void {}
  
  toggleFavorite(id: string): void {
    this.bookmarkService.toggleFavorite(id);
  }
  
  editBookmark(bookmark: Bookmark): void {
    this.bookmarkService.editBookmark(bookmark);
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