import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-folder-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Folder: {{ folderId }}</h1>
      <p>Folder page will display bookmarks in the selected folder.</p>
    </div>
  `
})
export class FolderPageComponent implements OnInit {
  folderId = '';
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.folderId = params.get('id') || '';
    });
  }
}