import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Book, ReadingStatus } from '../../../core/models/book.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent],
  template: `
    <div class="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div class="relative overflow-hidden">
        <img 
          [src]="book.coverUrl" 
          [alt]="book.title"
          class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <button 
            [routerLink]="['/books', book.id]"
            class="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-lg font-medium transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
          >
            View Details
          </button>
        </div>
      </div>
      
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-1 line-clamp-2">{{ book.title }}</h3>
        <p class="text-gray-600 mb-2">by {{ book.author }}</p>
        
        <div class="mb-3">
          <app-star-rating 
            [rating]="book.averageRating" 
            [readonly]="true"
            [showRating]="true"
            [reviewCount]="book.ratingsCount">
          </app-star-rating>
        </div>
        
        <div class="flex flex-wrap gap-1 mb-3">
          <span 
            *ngFor="let genre of book.genre.slice(0, 2)"
            class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full"
          >
            {{ genre }}
          </span>
        </div>
        
        <div class="flex space-x-2">
          <button 
            (click)="onAddToLibrary('to-read')"
            class="flex-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            Want to Read
          </button>
          <button 
            (click)="onAddToLibrary('reading')"
            class="flex-1 text-sm btn-primary px-3 py-2"
          >
            Reading
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() addToLibrary = new EventEmitter<{ bookId: string; status: ReadingStatus }>();

  onAddToLibrary(status: ReadingStatus): void {
    this.addToLibrary.emit({ bookId: this.book.id, status });
  }
}