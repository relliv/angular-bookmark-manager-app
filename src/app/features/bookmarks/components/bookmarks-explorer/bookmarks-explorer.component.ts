import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../services/bookmark.service';
import { FolderService } from '../../services/folder.service';
import { Bookmark } from '../../models/bookmark.model';
import { Folder } from '../../models/folder.model';

@Component({
  selector: 'app-bookmarks-explorer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <div class="grid grid-cols-[300px_1fr] divide-x divide-neutral-200 dark:divide-neutral-700">
        <!-- Folder tree -->
        <div class="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div class="mb-2 flex items-center justify-between p-2">
            <h3 class="text-sm font-medium">Folders</h3>
            <button class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300" (click)="addFolder()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-1">
            <div class="px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer flex items-center"
                 [class.bg-neutral-100]="currentFolder === null" 
                 [class.dark:bg-neutral-700]="currentFolder === null"
                 (click)="selectFolder(null)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              All Bookmarks
            </div>
            
            <ng-container *ngFor="let folder of rootFolders">
              <div class="px-2 py-1.5 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer flex items-center"
                   [class.bg-neutral-100]="currentFolder?.id === folder.id"
                   [class.dark:bg-neutral-700]="currentFolder?.id === folder.id"
                   (click)="selectFolder(folder)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {{ folder.name }}
              </div>
            </ng-container>
          </div>
        </div>
        
        <!-- Bookmark list -->
        <div class="overflow-y-auto max-h-[calc(100vh-200px)]">
          <div class="p-4">
            <h2 class="text-lg font-medium mb-4">{{ currentFolder?.name || 'All Bookmarks' }}</h2>
            
            <div class="space-y-2">
              <div *ngFor="let bookmark of filteredBookmarks" 
                   class="p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-start group">
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
                  <p *ngIf="bookmark.description" class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
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
                
                <div class="ml-4 flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <button [class.text-amber-500]="bookmark.isFavorite" [class.text-neutral-400]="!bookmark.isFavorite" 
                          (click)="toggleFavorite(bookmark.id)" class="hover:text-amber-600 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" [class.fill-current]="bookmark.isFavorite" viewBox="0 0 24 24" stroke="currentColor" [class.stroke-0]="bookmark.isFavorite" [class.stroke-2]="!bookmark.isFavorite">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                  <button class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 p-1" (click)="editBookmark(bookmark)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button class="text-neutral-400 hover:text-error-600 p-1" (click)="deleteBookmark(bookmark.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Empty state -->
              <div *ngIf="filteredBookmarks.length === 0" class="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-neutral-300 dark:text-neutral-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p class="text-neutral-500 dark:text-neutral-400 mb-4">No bookmarks found in this folder</p>
                <button class="primary-button" (click)="addBookmark()">Add Bookmark</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BookmarksExplorerComponent implements OnInit {
  bookmarks: Bookmark[] = [];
  filteredBookmarks: Bookmark[] = [];
  rootFolders: Folder[] = [];
  currentFolder: Folder | null = null;
  
  constructor(
    private bookmarkService: BookmarkService,
    private folderService: FolderService
  ) {}
  
  ngOnInit(): void {
    this.bookmarkService.getBookmarks().subscribe(bookmarks => {
      this.bookmarks = bookmarks;
      this.filterBookmarks();
    });
    
    this.folderService.getRootFolders().subscribe(folders => {
      this.rootFolders = folders;
    });
  }
  
  selectFolder(folder: Folder | null): void {
    this.currentFolder = folder;
    this.filterBookmarks();
  }
  
  filterBookmarks(): void {
    if (this.currentFolder) {
      this.filteredBookmarks = this.bookmarks.filter(
        bookmark => bookmark.folderId === this.currentFolder?.id
      );
    } else {
      this.filteredBookmarks = this.bookmarks;
    }
  }
  
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
  
  addFolder(): void {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      this.folderService.addFolder({
        name: folderName,
        parentId: this.currentFolder?.id
      });
    }
  }
}