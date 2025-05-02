import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Tag: {{ tagId }}</h1>
      <p>Tag page will display bookmarks with the selected tag.</p>
    </div>
  `
})
export class TagPageComponent implements OnInit {
  tagId = '';
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tagId = params.get('id') || '';
    });
  }
}