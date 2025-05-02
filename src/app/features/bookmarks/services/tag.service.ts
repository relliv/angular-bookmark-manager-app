import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Tag } from '../models/tag.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private STORAGE_KEY = 'tags';
  private tagsSubject = new BehaviorSubject<Tag[]>([]);
  tags$ = this.tagsSubject.asObservable();
  
  constructor() {
    this.loadTags();
  }
  
  private loadTags(): void {
    try {
      const storedTags = localStorage.getItem(this.STORAGE_KEY);
      const tags = storedTags ? JSON.parse(storedTags) : this.generateSampleTags();
      
      this.tagsSubject.next(tags);
      
      // Save sample tags if none were found
      if (!storedTags) {
        this.saveTags(tags);
      }
    } catch (error) {
      console.error('Error loading tags', error);
      this.tagsSubject.next([]);
    }
  }
  
  private saveTags(tags: Tag[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tags));
    } catch (error) {
      console.error('Error saving tags', error);
    }
  }
  
  getTags(): Observable<Tag[]> {
    return this.tags$;
  }
  
  getTagById(id: string): Observable<Tag | undefined> {
    const tags = this.tagsSubject.value;
    const tag = tags.find(t => t.id === id);
    return of(tag);
  }
  
  addTag(tag: Omit<Tag, 'id'>): void {
    const newTag: Tag = {
      ...tag,
      id: uuidv4()
    };
    
    const tags = [...this.tagsSubject.value, newTag];
    this.tagsSubject.next(tags);
    this.saveTags(tags);
  }
  
  updateTag(id: string, updates: Partial<Tag>): void {
    const tags = this.tagsSubject.value;
    const index = tags.findIndex(t => t.id === id);
    
    if (index !== -1) {
      const updatedTag = {
        ...tags[index],
        ...updates
      };
      
      const updatedTags = [
        ...tags.slice(0, index),
        updatedTag,
        ...tags.slice(index + 1)
      ];
      
      this.tagsSubject.next(updatedTags);
      this.saveTags(updatedTags);
    }
  }
  
  deleteTag(id: string): void {
    const tags = this.tagsSubject.value;
    const filteredTags = tags.filter(t => t.id !== id);
    
    this.tagsSubject.next(filteredTags);
    this.saveTags(filteredTags);
  }
  
  private generateSampleTags(): Tag[] {
    return [
      {
        id: uuidv4(),
        name: 'Development',
        color: '#3b82f6' // blue
      },
      {
        id: uuidv4(),
        name: 'Design',
        color: '#ec4899' // pink
      },
      {
        id: uuidv4(),
        name: 'Productivity',
        color: '#10b981' // green
      },
      {
        id: uuidv4(),
        name: 'Reference',
        color: '#f59e0b' // amber
      },
      {
        id: uuidv4(),
        name: 'Tutorial',
        color: '#8b5cf6' // purple
      }
    ];
  }
}