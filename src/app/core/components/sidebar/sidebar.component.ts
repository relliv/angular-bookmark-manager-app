import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FolderService } from '../../../features/bookmarks/services/folder.service';
import { Folder } from '../../../features/bookmarks/models/folder.model';
import { TagService } from '../../../features/bookmarks/services/tag.service';
import { Tag } from '../../../features/bookmarks/models/tag.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
      <div class="p-4">
        <nav class="space-y-1">
          <a routerLink="/bookmarks" routerLinkActive="bg-neutral-100 dark:bg-neutral-800" [routerLinkActiveOptions]="{exact: true}" 
             class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            All Bookmarks
          </a>
          
          <a routerLink="/favorites" routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
             class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Favorites
          </a>
          
          <a routerLink="/recent" routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
             class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent
          </a>
        </nav>
        
        <!-- Folders -->
        <div class="mt-8">
          <div class="flex items-center justify-between px-3 mb-2">
            <h2 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Folders</h2>
            <button class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <nav class="space-y-1">
            <ng-container *ngFor="let folder of folders">
              <a [routerLink]="['/folder', folder.id]" routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
                 class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {{ folder.name }}
              </a>
            </ng-container>
          </nav>
        </div>
        
        <!-- Tags -->
        <div class="mt-8">
          <div class="flex items-center justify-between px-3 mb-2">
            <h2 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tags</h2>
            <button class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-1">
            <div *ngFor="let tag of tags" 
                 class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
              <span class="w-3 h-3 rounded-full mr-3" [style.backgroundColor]="tag.color"></span>
              {{ tag.name }}
            </div>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  folders: Folder[] = [];
  tags: Tag[] = [];
  
  constructor(
    private folderService: FolderService,
    private tagService: TagService
  ) {}
  
  ngOnInit(): void {
    this.folderService.getFolders().subscribe(folders => {
      this.folders = folders;
    });
    
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }
}