import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { ThemeService } from './core/services/theme.service';
import { BookmarkListComponent } from './features/bookmarks/components/bookmark-list/bookmark-list.component';
import { BookmarkGridComponent } from './features/bookmarks/components/bookmark-grid/bookmark-grid.component';
import { BookmarksExplorerComponent } from './features/bookmarks/components/bookmarks-explorer/bookmarks-explorer.component';
import { BookmarkService } from './features/bookmarks/services/bookmark.service';
import { ViewModeService } from './core/services/view-mode.service';
import { SearchBarComponent } from './core/components/search-bar/search-bar.component';
import { AddBookmarkDialogComponent } from './features/bookmarks/components/add-bookmark-dialog/add-bookmark-dialog.component';
import { EditBookmarkDialogComponent } from './features/bookmarks/components/edit-bookmark-dialog/edit-bookmark-dialog.component';
import { Bookmark } from './features/bookmarks/models/bookmark.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BookmarkListComponent,
    BookmarkGridComponent,
    BookmarksExplorerComponent,
    SearchBarComponent,
    AddBookmarkDialogComponent,
    EditBookmarkDialogComponent
  ],
  providers: [ThemeService, ViewModeService, BookmarkService],
  template: `
    <div class="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      <app-header (addBookmark)="showAddBookmarkDialog = true"></app-header>
      <div class="flex flex-1 overflow-hidden">
        <app-sidebar></app-sidebar>
        <main class="flex-1 overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <app-add-bookmark-dialog *ngIf="showAddBookmarkDialog"
                            (close)="showAddBookmarkDialog = false"
                            (save)="handleSaveBookmark($event)">
    </app-add-bookmark-dialog>

    <app-edit-bookmark-dialog *ngIf="bookmarkToEdit"
                             [bookmark]="bookmarkToEdit"
                             (close)="bookmarkToEdit = null"
                             (save)="handleEditBookmark($event)">
    </app-edit-bookmark-dialog>
  `
})
export class AppComponent implements OnInit {
  @HostBinding('class.dark') isDarkMode = false;
  
  showAddBookmarkDialog = false;
  bookmarkToEdit: Bookmark | null = null;

  constructor(
    private themeService: ThemeService,
    private bookmarkService: BookmarkService
  ) {
    this.bookmarkService.bookmarkToEdit$.subscribe(bookmark => {
      this.bookmarkToEdit = bookmark;
    });
  }

  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  handleSaveBookmark(data: any): void {
    this.bookmarkService.addBookmark({
      url: data.url,
      title: data.title,
      description: data.description,
      folderId: data.folderId || undefined,
      tags: data.tags,
      isFavorite: data.isFavorite
    });
    this.showAddBookmarkDialog = false;
  }

  handleEditBookmark(data: any): void {
    if (this.bookmarkToEdit) {
      this.bookmarkService.updateBookmark(this.bookmarkToEdit.id, {
        url: data.url,
        title: data.title,
        description: data.description,
        folderId: data.folderId || undefined,
        tags: data.tags,
        isFavorite: data.isFavorite
      });
      this.bookmarkToEdit = null;
    }
  }
}