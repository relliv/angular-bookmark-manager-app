import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Bookmark } from '../../models/bookmark.model';

@Component({
  selector: 'app-bookmark-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-start group">
      <img *ngIf="bookmark.faviconUrl" [src]="bookmark.faviconUrl" alt="Favicon" class="h-5 w-5 mr-3 mt-0.5">
      <div *ngIf="!bookmark.faviconUrl" class="h-5 w-5 mr-3 mt-0.5 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-xs">
        {{ bookmark.title.charAt(0).toUpperCase() }}
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center">
          <h3 class="text-sm font-medium truncate">
            <a [href]="bookmark.url" target="_blank" class="hover:text-primary-600 transition-colors">
              {{ bookmark.title }}
            </a>
          </h3>
          <button *ngIf="bookmark.isFavorite" class="ml-2 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">{{ bookmark.url }}</p>
        <p *ngIf="bookmark.description" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
          {{ bookmark.description }}
        </p>
        <div *ngIf="bookmark.tags && bookmark.tags.length > 0" class="mt-1.5 flex flex-wrap gap-1">
          <span *ngFor="let tag of bookmark.tags" 
                class="px-1.5 py-0.5 text-xs rounded-full"
                [style.backgroundColor]="tag.color + '33'"
                [style.color]="tag.color">
            {{ tag.name }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class BookmarkItemComponent {
  @Input() bookmark!: Bookmark;
}