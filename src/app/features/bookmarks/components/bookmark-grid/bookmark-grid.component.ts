import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';
import { LucideAngularModule, BookmarkIcon, StarIcon, PencilIcon, TrashIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-bookmark-grid',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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
              <lucide-angular [img]="StarIcon" class="h-4 w-4" [class.fill-current]="bookmark.isFavorite"></lucide-angular>
            </button>
            <button class="p-1 bg-neutral-800/70 rounded-full hover:bg-neutral-900/70 text-white" (click)="editBookmark(bookmark)">
              <lucide-angular [img]="PencilIcon" class="h-4 w-4"></lucide-angular>
            </button>
            <button class="p-1 bg-neutral-800/70 rounded-full hover:bg-neutral-900/70 text-white" (click)="deleteBookmark(bookmark.id)">
              <lucide-angular [img]="TrashIcon" class="h-4 w-4"></lucide-angular>
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
          <lucide-angular [img]="BookmarkIcon" class="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4"></lucide-angular>
          <p class="text-neutral-500 dark:text-neutral-400 mb-4">No bookmarks found</p>
          <button class="primary-button flex items-center mx-auto" (click)="addBookmark()">
            <lucide-angular [img]="PlusIcon" class="h-4 w-4 mr-1"></lucide-angular>
            Add Bookmark
          </button>
        </div>
      </div>
    </div>
  `
})
export class BookmarkGridComponent implements OnInit {
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