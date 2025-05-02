import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tag } from '../../models/tag.model';
import { TagService } from '../../services/tag.service';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';
import { Bookmark } from '../../models/bookmark.model';

@Component({
  selector: 'app-edit-bookmark-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
         (click)="closeDialog()">
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-lg mx-4 z-50"
           (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Edit Bookmark</h2>
            <button class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    (click)="closeDialog()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form (submit)="handleSubmit($event)" class="space-y-4">
            <div>
              <label for="url" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                URL *
              </label>
              <input type="url" id="url" name="url" required
                     [(ngModel)]="formData.url"
                     class="notion-input"
                     placeholder="https://example.com">
            </div>
            
            <div>
              <label for="title" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Title *
              </label>
              <input type="text" id="title" name="title" required
                     [(ngModel)]="formData.title"
                     class="notion-input"
                     placeholder="My Bookmark">
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Description
              </label>
              <textarea id="description" name="description" rows="3"
                        [(ngModel)]="formData.description"
                        class="notion-input"
                        placeholder="Add a description..."></textarea>
            </div>
            
            <div>
              <label for="folder" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Folder
              </label>
              <div class="relative">
                <select id="folder" name="folder"
                        [(ngModel)]="formData.folderId"
                        class="notion-input">
                  <option value="">No folder</option>
                  <option *ngFor="let folder of folders" [value]="folder.id">
                    {{ folder.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Tags
              </label>
              <div class="relative">
                <input type="text"
                       [(ngModel)]="tagInput"
                       name="tagInput"
                       class="notion-input"
                       placeholder="Add tags..."
                       (focus)="showTagSuggestions = true"
                       (input)="filterTags()">
                       
                <div *ngIf="showTagSuggestions && filteredTags.length > 0"
                     class="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700">
                  <div class="py-1">
                    <button *ngFor="let tag of filteredTags"
                            type="button"
                            class="w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center"
                            (click)="addTag(tag)">
                      <span class="w-3 h-3 rounded-full mr-2" [style.backgroundColor]="tag.color"></span>
                      {{ tag.name }}
                    </button>
                  </div>
                </div>
              </div>
              
              <div *ngIf="formData.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
                <span *ngFor="let tag of formData.tags" 
                      class="inline-flex items-center px-2 py-1 rounded-full text-sm"
                      [style.backgroundColor]="tag.color + '33'"
                      [style.color]="tag.color">
                  {{ tag.name }}
                  <button type="button" class="ml-1 hover:text-neutral-700" (click)="removeTag(tag)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
            
            <div class="flex items-center mt-6">
              <input type="checkbox" id="favorite" name="favorite"
                     [(ngModel)]="formData.isFavorite"
                     class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded">
              <label for="favorite" class="ml-2 block text-sm text-neutral-700 dark:text-neutral-300">
                Add to favorites
              </label>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" 
                      class="secondary-button"
                      (click)="closeDialog()">
                Cancel
              </button>
              <button type="submit" 
                      class="primary-button">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EditBookmarkDialogComponent {
  @Input() bookmark!: Bookmark;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  formData = {
    url: '',
    title: '',
    description: '',
    folderId: '',
    tags: [] as Tag[],
    isFavorite: false
  };
  
  tagInput = '';
  showTagSuggestions = false;
  tags: Tag[] = [];
  filteredTags: Tag[] = [];
  folders: Folder[] = [];
  
  constructor(
    private tagService: TagService,
    private folderService: FolderService
  ) {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
      this.filteredTags = tags;
    });
    
    this.folderService.getFolders().subscribe(folders => {
      this.folders = folders;
    });
  }
  
  ngOnInit(): void {
    this.formData = {
      url: this.bookmark.url,
      title: this.bookmark.title,
      description: this.bookmark.description || '',
      folderId: this.bookmark.folderId || '',
      tags: this.bookmark.tags || [],
      isFavorite: this.bookmark.isFavorite
    };
  }
  
  filterTags(): void {
    if (!this.tagInput.trim()) {
      this.filteredTags = this.tags;
      return;
    }
    
    const search = this.tagInput.toLowerCase();
    this.filteredTags = this.tags.filter(tag => 
      tag.name.toLowerCase().includes(search) &&
      !this.formData.tags.some(t => t.id === tag.id)
    );
  }
  
  addTag(tag: Tag): void {
    if (!this.formData.tags.some(t => t.id === tag.id)) {
      this.formData.tags.push(tag);
    }
    this.tagInput = '';
    this.showTagSuggestions = false;
  }
  
  removeTag(tag: Tag): void {
    this.formData.tags = this.formData.tags.filter(t => t.id !== tag.id);
  }
  
  closeDialog(): void {
    this.close.emit();
  }
  
  handleSubmit(event: Event): void {
    event.preventDefault();
    this.save.emit(this.formData);
  }
}