import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input 
        type="text" 
        class="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md notion-input" 
        placeholder="Search bookmarks, folders, or tags..."
        [(ngModel)]="searchTerm"
        (input)="onSearch()"
      >
    </div>
  `
})
export class SearchBarComponent {
  searchTerm = '';
  
  onSearch(): void {
    console.log('Searching for:', this.searchTerm);
    // This will be connected to a search service
  }
}