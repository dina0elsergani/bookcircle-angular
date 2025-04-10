import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, startWith, debounceTime } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BookService } from '../../../core/services/book.service';
import { Book, BookSearchFilters, ReadingStatus } from '../../../core/models/book.model';
import { BookCardComponent } from '../../../shared/components/book-card/book-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Discover Books</h1>
          <p class="text-gray-600">Find your next great read from our curated collection</p>
        </div>

        <!-- Search and Filters -->
        <div class="card p-6 mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </label>
              <input
                id="search"
                type="text"
                [formControl]="searchControl"
                placeholder="Search by title or author..."
                class="input"
              />
            </div>

            <div>
              <label for="genre" class="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select [formControl]="genreControl" id="genre" class="input">
                <option value="">All Genres</option>
                <option value="Fiction">Fiction</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Thriller">Thriller</option>
                <option value="Historical Fiction">Historical Fiction</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Biography">Biography</option>
                <option value="Memoir">Memoir</option>
                <option value="Philosophy">Philosophy</option>
                <option value="Psychology">Psychology</option>
              </select>
            </div>

            <div>
              <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select [formControl]="sortControl" id="sortBy" class="input">
                <option value="title:asc">Title (A-Z)</option>
                <option value="title:desc">Title (Z-A)</option>
                <option value="author:asc">Author (A-Z)</option>
                <option value="author:desc">Author (Z-A)</option>
                <option value="rating:desc">Highest Rated</option>
                <option value="rating:asc">Lowest Rated</option>
                <option value="publishedDate:desc">Newest First</option>
                <option value="publishedDate:asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex items-center space-x-4">
            <label class="flex items-center">
              <input
                type="checkbox"
                [formControl]="highRatingControl"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">4+ Stars Only</span>
            </label>
          </div>
        </div>

        <!-- Book Grid -->
        <div *ngIf="books$ | async as books; else loadingBooks">
          <div class="mb-4 flex items-center justify-between">
            <p class="text-sm text-gray-600">{{ books.length }} books found</p>
          </div>

          <div *ngIf="books.length > 0; else noBooksFound" 
               class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <app-book-card
              *ngFor="let book of books; trackBy: trackByBookId"
              [book]="book"
              (addToLibrary)="onAddToLibrary($event)"
              class="animate-fade-in"
            ></app-book-card>
          </div>

          <ng-template #noBooksFound>
            <div class="card p-12 text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0012 15c-2.34 0-4.5-.785-6.23-2.109C5.344 12.48 5 12.017 5 11.5V7a2 2 0 012-2h10a2 2 0 012 2v4.5c0 .517-.344.98-.77 1.391z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p class="text-gray-600 mb-4">Try adjusting your search criteria or browse all books.</p>
              <button 
                (click)="clearFilters()"
                class="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          </ng-template>
        </div>

        <ng-template #loadingBooks>
          <app-loading-spinner message="Loading books..."></app-loading-spinner>
        </ng-template>

        <!-- Success Message -->
        <div 
          *ngIf="successMessage"
          class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up"
        >
          {{ successMessage }}
        </div>
      </div>
    </div>
  `
})
export class BookListComponent implements OnInit {
  searchControl = new FormControl('');
  genreControl = new FormControl('');
  sortControl = new FormControl('title:asc');
  highRatingControl = new FormControl(false);

  books$: Observable<Book[]>;
  successMessage = '';

  constructor(private bookService: BookService) {
    this.books$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
      this.genreControl.valueChanges.pipe(startWith('')),
      this.sortControl.valueChanges.pipe(startWith('title:asc')),
      this.highRatingControl.valueChanges.pipe(startWith(false))
    ]).pipe(
      map(([search, genre, sort, highRating]) => {
        const [sortBy, sortOrder] = (sort || 'title:asc').split(':');
        const filters: BookSearchFilters = {
          query: search || undefined,
          genre: genre || undefined,
          sortBy: sortBy as any,
          sortOrder: sortOrder as any,
          minRating: highRating ? 4 : undefined
        };
        return filters;
      }),
      switchMap(filters => this.bookService.getBooks(filters))
    );
  }

  ngOnInit(): void {}

  onAddToLibrary(event: { bookId: string; status: ReadingStatus }): void {
    this.bookService.addBookToLibrary(event.bookId, event.status).subscribe({
      next: (userBook) => {
        const statusText = event.status === 'to-read' ? 'Want to Read' : 
                          event.status === 'reading' ? 'Currently Reading' : 'Read';
        this.successMessage = `Added "${userBook.book.title}" to ${statusText}!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error adding book to library:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.genreControl.setValue('');
    this.sortControl.setValue('title:asc');
    this.highRatingControl.setValue(false);
  }

  trackByBookId(index: number, book: Book): string {
    return book.id;
  }
}