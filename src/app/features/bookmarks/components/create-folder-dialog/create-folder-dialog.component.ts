import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FolderService } from '../../services/folder.service';
import { Folder } from '../../models/folder.model';

@Component({
  selector: 'app-create-folder-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
         (click)="closeDialog()">
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md mx-4 z-50"
           (click)="$event.stopPropagation()">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">Create New Folder</h2>
            <button class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    (click)="closeDialog()">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form (submit)="handleSubmit($event)" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Folder Name *
              </label>
              <input type="text" id="name" name="name" required
                     [(ngModel)]="folderName"
                     class="notion-input"
                     placeholder="My Folder">
            </div>
            
            <div>
              <label for="parentFolder" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Parent Folder
              </label>
              <div class="relative">
                <select id="parentFolder" name="parentFolder"
                        [(ngModel)]="parentFolderId"
                        class="notion-input">
                  <option value="">No parent folder</option>
                  <option *ngFor="let folder of folders" [value]="folder.id">
                    {{ folder.name }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" 
                      class="secondary-button"
                      (click)="closeDialog()">
                Cancel
              </button>
              <button type="submit" 
                      class="primary-button"
                      [disabled]="!folderName.trim()">
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CreateFolderDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  
  folderName = '';
  parentFolderId = '';
  folders: Folder[] = [];
  
  constructor(private folderService: FolderService) {
    this.folderService.getFolders().subscribe(folders => {
      this.folders = folders;
    });
  }
  
  closeDialog(): void {
    this.close.emit();
  }
  
  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.folderName.trim()) {
      this.save.emit({
        name: this.folderName.trim(),
        parentId: this.parentFolderId || undefined
      });
    }
  }
}