import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type ViewMode = 'list' | 'grid' | 'explorer';

@Injectable({
  providedIn: 'root'
})
export class ViewModeService {
  private readonly VIEW_MODE_KEY = 'bookmarkManagerViewMode';
  private viewModeSubject = new BehaviorSubject<ViewMode>('list');
  
  currentViewMode$ = this.viewModeSubject.asObservable();
  
  constructor() {
    this.initViewMode();
  }
  
  private initViewMode(): void {
    const savedViewMode = localStorage.getItem(this.VIEW_MODE_KEY) as ViewMode | null;
    if (savedViewMode && ['list', 'grid', 'explorer'].includes(savedViewMode)) {
      this.viewModeSubject.next(savedViewMode);
    }
  }
  
  setViewMode(mode: string): void {
    const viewMode = mode as ViewMode;
    if (['list', 'grid', 'explorer'].includes(viewMode)) {
      localStorage.setItem(this.VIEW_MODE_KEY, viewMode);
      this.viewModeSubject.next(viewMode);
    }
  }
}