import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BookmarkService } from '../../services/bookmark.service';
import { Bookmark } from '../../models/bookmark.model';
import { LucideAngularModule, BookmarkIcon, StarIcon, PencilIcon, TrashIcon, PlusIcon, GripIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-angular';

type SortField = 'title' | 'url' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface SortOption {
  field: SortField;
  label: string;
}

@Component({
  selector: 'app-bookmark-grid',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DragDropModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <select 
            class="notion-input max-w-xs"
            [(ngModel)]="groupBy"
            (change)="updateGroups()">
            <option value="">No grouping</option>
            <option value="folder">Group by Folder</option>
            <option value="tag">Group by Tag</option>
            <option value="favorite">Group by Favorite</option>
            <option value="custom">Custom Groups</option>
          </select>

          <div class="flex items-center space-x-2">
            <select 
              class="notion-input max-w-xs"
              [(ngModel)]="sortField"
              (change)="updateSort()">
              <option *ngFor="let option of sortOptions" [value]="option.field">
                Sort by {{ option.label }}
              </option>
            </select>
            <button 
              class="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              (click)="toggleSortDirection()">
              <lucide-angular 
                [img]="sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon" 
                class="h-5 w-5">
              </lucide-angular>
            </button>
          </div>
        </div>
      </div>

      <!-- Ungrouped view -->
      <div *ngIf="!groupBy" 
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
           cdkDropList
           [cdkDropListData]="sortedBookmarks"
           (cdkDropListDropped)="drop($event)">
        <div *ngFor="let bookmark of sortedBookmarks" 
             class="notion-card group overflow-hidden flex flex-col"
             cdkDrag
             [cdkDragData]="bookmark">
          <!-- Drag preview -->
          <div *cdkDragPreview class="notion-card p-4 bg-white dark:bg-neutral-800 shadow-lg">
            <div class="flex items-center">
              <img *ngIf="bookmark.faviconUrl" [src]="bookmark.faviconUrl" alt="Favicon" class="h-4 w-4 mr-2">
              <span class="text-sm font-medium">{{ bookmark.title }}</span>
            </div>
          </div>

          <!-- Drag placeholder -->
          <div *cdkDragPlaceholder class="notion-card bg-neutral-100 dark:bg-neutral-700 border-2 border-dashed border-primary-500">
          </div>

          <div class="absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
            <lucide-angular [img]="GripIcon" class="h-4 w-4 text-neutral-400"></lucide-angular>
          </div>
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
      </div>

      <!-- Grouped view -->
      <div *ngIf="groupBy" class="space-y-8">
        <div *ngFor="let group of groups" class="space-y-4">
          <h3 class="text-lg font-medium">{{ group.title }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
               cdkDropList
               [cdkDropListData]="group.bookmarks"
               [cdkDropListConnectedTo]="getConnectedListIds()"
               (cdkDropListDropped)="drop($event)">
            <div *ngFor="let bookmark of sortBookmarks(group.bookmarks)" 
                 class="notion-card group overflow-hidden flex flex-col"
                 cdkDrag
                 [cdkDragData]="bookmark">
              <!-- Drag preview -->
              <div *cdkDragPreview class="notion-card p-4 bg-white dark:bg-neutral-800 shadow-lg">
                <div class="flex items-center">
                  <img *ngIf="bookmark.faviconUrl" [src]="bookmark.faviconUrl" alt="Favicon" class="h-4 w-4 mr-2">
                  <span class="text-sm font-medium">{{ bookmark.title }}</span>
                </div>
              </div>

              <!-- Drag placeholder -->
              <div *cdkDragPlaceholder class="notion-card bg-neutral-100 dark:bg-neutral-700 border-2 border-dashed border-primary-500">
              </div>

              <div class="absolute top-2 left-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                <lucide-angular [img]="GripIcon" class="h-4 w-4 text-neutral-400"></lucide-angular>
              </div>
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
  readonly GripIcon = GripIcon;
  readonly ArrowUpIcon = ArrowUpIcon;
  readonly ArrowDownIcon = ArrowDownIcon;

  groupBy = '';
  groups: BookmarkGroup[] = [];
  customGroups: Map<string, BookmarkGroup> = new Map();

  sortField: SortField = 'createdAt';
  sortDirection: SortDirection = 'desc';
  sortedBookmarks: Bookmark[] = [];

  sortOptions: SortOption[] = [
    { field: 'title', label: 'Title' },
    { field: 'url', label: 'URL' },
    { field: 'createdAt', label: 'Date Added' },
    { field: 'updatedAt', label: 'Last Updated' }
  ];
  
  constructor(private bookmarkService: BookmarkService) {}
  
  ngOnInit(): void {
    this.updateSort();
    this.updateGroups();
  }

  ngOnChanges(): void {
    this.updateSort();
    this.updateGroups();
  }

  updateSort(): void {
    this.sortedBookmarks = this.sortBookmarks([...this.bookmarks]);
  }

  sortBookmarks(bookmarks: Bookmark[]): Bookmark[] {
    return [...bookmarks].sort((a, b) => {
      let comparison = 0;
      
      if (this.sortField === 'title' || this.sortField === 'url') {
        comparison = a[this.sortField].localeCompare(b[this.sortField]);
      } else {
        comparison = new Date(a[this.sortField]).getTime() - new Date(b[this.sortField]).getTime();
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.updateSort();
  }

  updateGroups(): void {
    if (!this.groupBy) {
      this.groups = [];
      return;
    }

    switch (this.groupBy) {
      case 'folder':
        this.groupByFolder();
        break;
      case 'tag':
        this.groupByTag();
        break;
      case 'favorite':
        this.groupByFavorite();
        break;
      case 'custom':
        this.loadCustomGroups();
        break;
    }
  }

  private groupByFolder(): void {
    const folderGroups = new Map<string | undefined, Bookmark[]>();
    
    this.bookmarks.forEach(bookmark => {
      const folderId = bookmark.folderId;
      if (!folderGroups.has(folderId)) {
        folderGroups.set(folderId, []);
      }
      folderGroups.get(folderId)!.push(bookmark);
    });

    this.groups = Array.from(folderGroups.entries()).map(([folderId, bookmarks]) => ({
      id: folderId || 'no-folder',
      title: folderId ? 'Folder Name' : 'No Folder',
      bookmarks
    }));
  }

  private groupByTag(): void {
    const tagGroups = new Map<string, Bookmark[]>();
    const untagged: Bookmark[] = [];

    this.bookmarks.forEach(bookmark => {
      if (!bookmark.tags || bookmark.tags.length === 0) {
        untagged.push(bookmark);
        return;
      }

      bookmark.tags.forEach(tag => {
        if (!tagGroups.has(tag.id)) {
          tagGroups.set(tag.id, []);
        }
        tagGroups.get(tag.id)!.push(bookmark);
      });
    });

    this.groups = [
      ...Array.from(tagGroups.entries()).map(([tagId, bookmarks]) => ({
        id: tagId,
        title: bookmarks[0].tags!.find(t => t.id === tagId)!.name,
        bookmarks
      })),
      {
        id: 'untagged',
        title: 'Untagged',
        bookmarks: untagged
      }
    ];
  }

  private groupByFavorite(): void {
    const favorites = this.bookmarks.filter(b => b.isFavorite);
    const others = this.bookmarks.filter(b => !b.isFavorite);

    this.groups = [
      {
        id: 'favorites',
        title: 'Favorites',
        bookmarks: favorites
      },
      {
        id: 'others',
        title: 'Others',
        bookmarks: others
      }
    ];
  }

  private loadCustomGroups(): void {
    const savedGroups = localStorage.getItem('customBookmarkGroups');
    if (savedGroups) {
      this.customGroups = new Map(JSON.parse(savedGroups));
      this.groups = Array.from(this.customGroups.values());
    } else {
      this.groups = [{
        id: 'ungrouped',
        title: 'Ungrouped',
        bookmarks: [...this.bookmarks],
        isCustomGroup: true
      }];
    }
  }

  private saveCustomGroups(): void {
    localStorage.setItem('customBookmarkGroups', 
      JSON.stringify(Array.from(this.customGroups.entries())));
  }

  getConnectedListIds(): string[] {
    return this.groups.map(group => group.id);
  }

  drop(event: CdkDragDrop<Bookmark[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      if (this.groupBy === 'custom') {
        const draggedBookmark = event.item.data as Bookmark;
        const targetGroup = this.groups.find(g => g.bookmarks === event.container.data);
        const sourceGroup = this.groups.find(g => g.bookmarks === event.previousContainer.data);

        if (targetGroup && sourceGroup) {
          // Update group associations
          if (sourceGroup.bookmarks.length === 0) {
            this.groups = this.groups.filter(g => g.id !== sourceGroup.id);
            this.customGroups.delete(sourceGroup.id);
          }

          this.saveCustomGroups();
        }
      } else if (this.groupBy === 'folder') {
        const bookmark = event.item.data as Bookmark;
        const targetGroupId = this.groups.find(g => g.bookmarks === event.container.data)?.id;
        this.bookmarkService.updateBookmark(bookmark.id, { 
          folderId: targetGroupId === 'no-folder' ? undefined : targetGroupId 
        });
      } else if (this.groupBy === 'favorite') {
        const bookmark = event.item.data as Bookmark;
        const targetGroupId = this.groups.find(g => g.bookmarks === event.container.data)?.id;
        this.bookmarkService.updateBookmark(bookmark.id, { 
          isFavorite: targetGroupId === 'favorites' 
        });
      }
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
  }
}

interface BookmarkGroup {
  id: string;
  title: string;
  bookmarks: Bookmark[];
  isCustomGroup?: boolean;
}