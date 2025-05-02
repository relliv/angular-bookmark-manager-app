import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FolderService } from '../../../features/bookmarks/services/folder.service';
import { Folder } from '../../../features/bookmarks/models/folder.model';
import { TagService } from '../../../features/bookmarks/services/tag.service';
import { Tag } from '../../../features/bookmarks/models/tag.model';
import { CreateFolderDialogComponent } from '../../../features/bookmarks/components/create-folder-dialog/create-folder-dialog.component';
import { LucideAngularModule, BookmarkIcon, StarIcon, ClockIcon, FolderIcon, PlusIcon } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, CreateFolderDialogComponent, LucideAngularModule],
  template: `
    <aside class="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
      <div class="p-4">
        <nav class="space-y-1">
          <a routerLink="/bookmarks" routerLinkActive="bg-neutral-100 dark:bg-neutral-800" [routerLinkActiveOptions]="{exact: true}" 
             class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <lucide-angular [img]="BookmarkIcon" class="h-5 w-5 mr-3 text-neutral-500"></lucide-angular>
            All Bookmarks
          </a>
          
          <a routerLink="/favorites" routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
             class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <lucide-angular [img]="StarIcon" class="h-5 w-5 mr-3 text-neutral-500"></lucide-angular>
            Favorites
          </a>
          
          <a routerLink="/recent" routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
             class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <lucide-angular [img]="ClockIcon" class="h-5 w-5 mr-3 text-neutral-500"></lucide-angular>
            Recent
          </a>
        </nav>
        
        <!-- Folders -->
        <div class="mt-8">
          <div class="flex items-center justify-between px-3 mb-2">
            <h2 class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Folders</h2>
            <button class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    (click)="showCreateFolderDialog = true">
              <lucide-angular [img]="PlusIcon" class="h-4 w-4"></lucide-angular>
            </button>
          </div>
          
          <nav class="space-y-1">
            <ng-container *ngFor="let folder of folders">
              <a [routerLink]="['/folder', folder.id]" routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
                 class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <lucide-angular [img]="FolderIcon" class="h-5 w-5 mr-3 text-neutral-500"></lucide-angular>
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
              <lucide-angular [img]="PlusIcon" class="h-4 w-4"></lucide-angular>
            </button>
          </div>
          
          <div class="space-y-1">
            <a *ngFor="let tag of tags" 
               [routerLink]="['/tag', tag.id]"
               routerLinkActive="bg-neutral-100 dark:bg-neutral-800"
               class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
              <span class="w-3 h-3 rounded-full mr-3" [style.backgroundColor]="tag.color"></span>
              {{ tag.name }}
            </a>
          </div>
        </div>
      </div>
    </aside>

    <app-create-folder-dialog *ngIf="showCreateFolderDialog"
                             (close)="showCreateFolderDialog = false"
                             (save)="handleCreateFolder($event)">
    </app-create-folder-dialog>
  `
})
export class SidebarComponent implements OnInit {
  folders: Folder[] = [];
  tags: Tag[] = [];
  showCreateFolderDialog = false;
  
  readonly BookmarkIcon = BookmarkIcon;
  readonly StarIcon = StarIcon;
  readonly ClockIcon = ClockIcon;
  readonly FolderIcon = FolderIcon;
  readonly PlusIcon = PlusIcon;
  
  constructor(
    private folderService: FolderService,
    private tagService: TagService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll sidebar to top on navigation
        const sidebarElement = document.querySelector('aside');
        if (sidebarElement) {
          sidebarElement.scrollTop = 0;
        }
      }
    });
  }
  
  ngOnInit(): void {
    this.folderService.getFolders().subscribe(folders => {
      this.folders = folders;
    });
    
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  handleCreateFolder(data: any): void {
    this.folderService.addFolder({
      name: data.name,
      parentId: data.parentId
    });
    this.showCreateFolderDialog = false;
  }
}