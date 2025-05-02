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
  private bookmarkToEditSubject = new BehaviorSubject<Bookmark | null>(null);
  
  bookmarks$ = this.bookmarksSubject.asObservable();
  bookmarkToEdit$ = this.bookmarkToEditSubject.asObservable();
  
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
  
  getRecentBookmarks(): Observable<Bookmark[]> {
    const bookmarks = this.bookmarksSubject.value;
    return of(
      [...bookmarks]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 20)
    );
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

  editBookmark(bookmark: Bookmark): void {
    this.bookmarkToEditSubject.next(bookmark);
  }
  
  // Generate sample bookmarks for demo purposes
  private generateSampleBookmarks(): Bookmark[] {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get sample folder IDs
    const workFolderId = localStorage.getItem('folders') ? 
      JSON.parse(localStorage.getItem('folders')!)[0].id : 
      'work-folder';
    
    const devFolderId = localStorage.getItem('folders') ? 
      JSON.parse(localStorage.getItem('folders')!)[2].id : 
      'dev-folder';
    
    return [
      {
        id: uuidv4(),
        url: 'https://angular.dev',
        title: 'Angular - The modern web developer platform',
        description: 'The modern web developer platform. One framework. Mobile & desktop.',
        faviconUrl: 'https://angular.dev/assets/images/favicons/favicon-32x32.png',
        screenshotUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
        folderId: devFolderId,
        isFavorite: true,
        createdAt: now,
        updatedAt: now,
        tags: [
          { id: 'dev-1', name: 'Development', color: '#3b82f6' },
          { id: 'framework-1', name: 'Framework', color: '#ef4444' }
        ]
      },
      {
        id: uuidv4(),
        url: 'https://github.com',
        title: 'GitHub: Where the world builds software',
        description: 'GitHub is where over 100 million developers shape the future of software, together.',
        faviconUrl: 'https://github.githubassets.com/favicons/favicon.png',
        screenshotUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
        folderId: devFolderId,
        isFavorite: false,
        createdAt: yesterday,
        updatedAt: yesterday,
        tags: [
          { id: 'dev-1', name: 'Development', color: '#3b82f6' },
          { id: 'collab-1', name: 'Collaboration', color: '#8b5cf6' }
        ]
      },
      {
        id: uuidv4(),
        url: 'https://tailwindcss.com',
        title: 'Tailwind CSS - Rapidly build modern websites',
        description: 'A utility-first CSS framework packed with classes that can be composed to build any design, directly in your markup.',
        faviconUrl: 'https://tailwindcss.com/favicons/favicon-32x32.png',
        screenshotUrl: 'https://images.pexels.com/photos/11035482/pexels-photo-11035482.jpeg',
        folderId: devFolderId,
        isFavorite: true,
        createdAt: lastWeek,
        updatedAt: lastWeek,
        tags: [
          { id: 'dev-1', name: 'Development', color: '#3b82f6' },
          { id: 'design-1', name: 'Design', color: '#ec4899' }
        ]
      },
      {
        id: uuidv4(),
        url: 'https://chat.openai.com',
        title: 'ChatGPT: Conversational AI by OpenAI',
        description: 'ChatGPT is an AI-powered chatbot that understands and generates human-like text.',
        faviconUrl: 'https://chat.openai.com/favicon.ico',
        screenshotUrl: 'https://images.pexels.com/photos/11035390/pexels-photo-11035390.jpeg',
        folderId: workFolderId,
        isFavorite: true,
        createdAt: now,
        updatedAt: now,
        tags: [
          { id: 'ai-1', name: 'AI', color: '#10b981' },
          { id: 'productivity-1', name: 'Productivity', color: '#f59e0b' }
        ]
      },
      {
        id: uuidv4(),
        url: 'https://stackoverflow.com',
        title: 'Stack Overflow - Where Developers Learn & Share',
        description: 'Stack Overflow is the largest, most trusted online community for developers.',
        faviconUrl: 'https://stackoverflow.com/favicon.ico',
        screenshotUrl: 'https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg',
        folderId: devFolderId,
        isFavorite: false,
        createdAt: yesterday,
        updatedAt: yesterday,
        tags: [
          { id: 'dev-1', name: 'Development', color: '#3b82f6' },
          { id: 'community-1', name: 'Community', color: '#8b5cf6' }
        ]
      },
      {
        id: uuidv4(),
        url: 'https://www.figma.com',
        title: 'Figma: The Collaborative Interface Design Tool',
        description: 'Figma is the leading collaborative design tool for building meaningful products.',
        faviconUrl: 'https://www.figma.com/favicon.ico',
        screenshotUrl: 'https://images.pexels.com/photos/11035476/pexels-photo-11035476.jpeg',
        folderId: workFolderId,
        isFavorite: true,
        createdAt: lastWeek,
        updatedAt: lastWeek,
        tags: [
          { id: 'design-1', name: 'Design', color: '#ec4899' },
          { id: 'productivity-1', name: 'Productivity', color: '#f59e0b' }
        ]
      },
      {
        id: uuidv4(),
        url: 'https://www.notion.so',
        title: 'Notion - One workspace. Every team.',
        description: 'We\'re more than a doc. Or a table. Customize Notion to work the way you do.',
        faviconUrl: 'https://www.notion.so/favicon.ico',
        screenshotUrl: 'https://images.pexels.com/photos/11035480/pexels-photo-11035480.jpeg',
        folderId: workFolderId,
        isFavorite: false,
        createdAt: now,
        updatedAt: now,
        tags: [
          { id: 'productivity-1', name: 'Productivity', color: '#f59e0b' },
          { id: 'organization-1', name: 'Organization', color: '#8b5cf6' }
        ]
      }
    ];
  }
}