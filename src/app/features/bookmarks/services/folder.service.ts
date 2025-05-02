import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Folder } from '../models/folder.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private STORAGE_KEY = 'folders';
  private foldersSubject = new BehaviorSubject<Folder[]>([]);
  folders$ = this.foldersSubject.asObservable();
  
  constructor() {
    this.loadFolders();
  }
  
  private loadFolders(): void {
    try {
      const storedFolders = localStorage.getItem(this.STORAGE_KEY);
      const folders = storedFolders ? JSON.parse(storedFolders) : this.generateSampleFolders();
      
      // Convert date strings to Date objects
      folders.forEach((folder: Folder) => {
        folder.createdAt = new Date(folder.createdAt);
        folder.updatedAt = new Date(folder.updatedAt);
      });
      
      this.foldersSubject.next(folders);
      
      // Save sample folders if none were found
      if (!storedFolders) {
        this.saveFolders(folders);
      }
    } catch (error) {
      console.error('Error loading folders', error);
      this.foldersSubject.next([]);
    }
  }
  
  private saveFolders(folders: Folder[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folders', error);
    }
  }
  
  getFolders(): Observable<Folder[]> {
    return this.folders$;
  }
  
  getFolderById(id: string): Observable<Folder | undefined> {
    const folders = this.foldersSubject.value;
    const folder = folders.find(f => f.id === id);
    return of(folder);
  }
  
  getChildFolders(parentId: string): Observable<Folder[]> {
    const folders = this.foldersSubject.value;
    const childFolders = folders.filter(f => f.parentId === parentId);
    return of(childFolders);
  }
  
  getRootFolders(): Observable<Folder[]> {
    const folders = this.foldersSubject.value;
    const rootFolders = folders.filter(f => !f.parentId);
    return of(rootFolders);
  }
  
  addFolder(folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newFolder: Folder = {
      ...folder,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const folders = [...this.foldersSubject.value, newFolder];
    this.foldersSubject.next(folders);
    this.saveFolders(folders);
  }
  
  updateFolder(id: string, updates: Partial<Folder>): void {
    const folders = this.foldersSubject.value;
    const index = folders.findIndex(f => f.id === id);
    
    if (index !== -1) {
      const updatedFolder = {
        ...folders[index],
        ...updates,
        updatedAt: new Date()
      };
      
      const updatedFolders = [
        ...folders.slice(0, index),
        updatedFolder,
        ...folders.slice(index + 1)
      ];
      
      this.foldersSubject.next(updatedFolders);
      this.saveFolders(updatedFolders);
    }
  }
  
  deleteFolder(id: string): void {
    const folders = this.foldersSubject.value;
    const filteredFolders = folders.filter(f => f.id !== id);
    
    this.foldersSubject.next(filteredFolders);
    this.saveFolders(filteredFolders);
  }
  
  private generateSampleFolders(): Folder[] {
    const now = new Date();
    
    const workId = uuidv4();
    const personalId = uuidv4();
    
    return [
      {
        id: workId,
        name: 'Work',
        createdAt: now,
        updatedAt: now
      },
      {
        id: personalId,
        name: 'Personal',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Development',
        parentId: workId,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Design Resources',
        parentId: workId,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Finance',
        parentId: personalId,
        createdAt: now,
        updatedAt: now
      }
    ];
  }
}