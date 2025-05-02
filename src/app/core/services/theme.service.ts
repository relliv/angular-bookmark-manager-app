import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'bookmarkManagerTheme';
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  
  isDarkMode$ = this.darkModeSubject.asObservable();
  
  constructor() {
    this.initTheme();
  }
  
  private initTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    
    this.setDarkMode(isDark);
  }
  
  toggleTheme(): void {
    this.setDarkMode(!this.darkModeSubject.value);
  }
  
  setDarkMode(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    this.darkModeSubject.next(isDark);
  }
}