import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Bookmark } from '../models/bookmark.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private STORAGE_KEY = 'bookmarks';
  private bookmarksSubject = new BehaviorSubject<Bookmark[]>([]);
  bookmarks$ = this.bookmarksSubject.asObservable();
  
  constructor() {
    this.loadBookmarks();
  }
  
  private loadBookmarks(): void {
    try {
      const storedBookmarks = localStorage.getItem(this.STORAGE_KEY);
      const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : this.generateSampleBookmarks();
      
      // Convert date strings to Date objects
      bookmarks.forEach((bookmark: Bookmark) => {
        bookmark.createdAt = new Date(bookmark.createdAt);
        bookmark.updatedAt = new Date(bookmark.updatedAt);
        if (bookmark.lastVisited) {
          bookmark.lastVisited = new Date(bookmark.lastVisited);
        }
      });
      
      this.bookmarksSubject.next(bookmarks);
      
      // Save sample bookmarks if none were found
      if (!storedBookmarks) {
        this.saveBookmarks(bookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks', error);
      this.bookmarksSubject.next([]);
    }
  }
  
  private saveBookmarks(bookmarks: Bookmark[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmarks', error);
    }
  }
  
  getBookmarks(): Observable<Bookmark[]> {
    return this.bookmarks$;
  }
  
  getBookmarkById(id: string): Observable<Bookmark | undefined> {
    const bookmarks = this.bookmarksSubject.value;
    const bookmark = bookmarks.find(b => b.id === id);
    return of(bookmark);
  }
  
  getBookmarksByFolderId(folderId: string): Observable<Bookmark[]> {
    const bookmarks = this.bookmarksSubject.value;
    const filteredBookmarks = bookmarks.filter(b => b.folderId === folderId);
    return of(filteredBookmarks);
  }
  
  getBookmarksByTag(tagId: string): Observable<Bookmark[]> {
    const bookmarks = this.bookmarksSubject.value;
    const filteredBookmarks = bookmarks.filter(b => b.tags?.some(t => t.id === tagId));
    return of(filteredBookmarks);
  }
  
  getFavorites(): Observable<Bookmark[]> {
    const bookmarks = this.bookmarksSubject.value;
    const favorites = bookmarks.filter(b => b.isFavorite);
    return of(favorites);
  }
  
  addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const bookmarks = [...this.bookmarksSubject.value, newBookmark];
    this.bookmarksSubject.next(bookmarks);
    this.saveBookmarks(bookmarks);
  }
  
  updateBookmark(id: string, updates: Partial<Bookmark>): void {
    const bookmarks = this.bookmarksSubject.value;
    const index = bookmarks.findIndex(b => b.id === id);
    
    if (index !== -1) {
      const updatedBookmark = {
        ...bookmarks[index],
        ...updates,
        updatedAt: new Date()
      };
      
      const updatedBookmarks = [
        ...bookmarks.slice(0, index),
        updatedBookmark,
        ...bookmarks.slice(index + 1)
      ];
      
      this.bookmarksSubject.next(updatedBookmarks);
      this.saveBookmarks(updatedBookmarks);
    }
  }
  
  deleteBookmark(id: string): void {
    const bookmarks = this.bookmarksSubject.value;
    const filteredBookmarks = bookmarks.filter(b => b.id !== id);
    
    this.bookmarksSubject.next(filteredBookmarks);
    this.saveBookmarks(filteredBookmarks);
  }
  
  toggleFavorite(id: string): void {
    const bookmarks = this.bookmarksSubject.value;
    const bookmark = bookmarks.find(b => b.id === id);
    
    if (bookmark) {
      this.updateBookmark(id, { isFavorite: !bookmark.isFavorite });
    }
  }
  
  // Generate sample bookmarks for demo purposes
  private generateSampleBookmarks(): Bookmark[] {
    return [
      {
        id: uuidv4(),
        url: 'https://angular.dev',
        title: 'Angular - The modern web developer platform',
        description: 'The modern web developer platform. One framework. Mobile & desktop.',
        faviconUrl: 'https://angular.dev/assets/images/favicons/favicon-32x32.png',
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        url: 'https://github.com',
        title: 'GitHub: Where the world builds software',
        description: 'GitHub is where over 100 million developers shape the future of software, together.',
        faviconUrl: 'https://github.githubassets.com/favicons/favicon.png',
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        url: 'https://tailwindcss.com',
        title: 'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML',
        description: 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
        faviconUrl: 'https://tailwindcss.com/favicons/favicon-32x32.png',
        isFavorite: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}