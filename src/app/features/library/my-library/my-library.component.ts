import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { BookService } from '../../../core/services/book.service';
import { UserBook, ReadingStatus } from '../../../core/models/book.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-my-library',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StarRatingComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">My Library</h1>
          <p class="text-gray-600">Manage your personal book collection and reading progress</p>
        </div>

        <!-- Status Filter Tabs -->
        <div class="mb-8">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-8">
              <button
                *ngFor="let status of statusTabs"
                (click)="statusFilter.setValue(status.value)"
                [class]="getTabClass(status.value)"
                class="py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
              >
                {{ status.label }}
                <span class="ml-2 bg-gray-100 text-gray-900 py-1 px-2 rounded-full text-xs">
                  {{ getBookCountForStatus(status.value) | async }}
                </span>
              </button>
            </nav>
          </div>
        </div>

        <!-- Books Grid -->
        <div *ngIf="filteredBooks$ | async as books; else loadingBooks">
          <div *ngIf="books.length > 0; else noBooksFound" 
               class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              *ngFor="let userBook of books; trackBy: trackByUserBookId"
              class="card hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <div class="p-6">
                <div class="flex space-x-4">
                  <img 
                    [src]="userBook.book.coverUrl" 
                    [alt]="userBook.book.title"
                    class="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                      {{ userBook.book.title }}
                    </h3>
                    <p class="text-gray-600 text-sm mb-2">by {{ userBook.book.author }}</p>
                    
                    <div class="mb-3">
                      <app-star-rating 
                        [rating]="userBook.book.averageRating" 
                        [readonly]="true"
                        [showRating]="false"
                      ></app-star-rating>
                    </div>

                    <div class="flex flex-wrap gap-1 mb-3">
                      <span 
                        *ngFor="let genre of userBook.book.genre.slice(0, 2)"
                        class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full"
                      >
                        {{ genre }}
                      </span>
                    </div>

                    <div class="text-xs text-gray-500 mb-3">
                      <div>Added: {{ userBook.dateAdded | date:'shortDate' }}</div>
                      <div *ngIf="userBook.dateStarted">
                        Started: {{ userBook.dateStarted | date:'shortDate' }}
                      </div>
                      <div *ngIf="userBook.dateFinished">
                        Finished: {{ userBook.dateFinished | date:'shortDate' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                  <!-- Status Update -->
                  <div class="mb-3">
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      Reading Status
                    </label>
                    <select 
                      [value]="userBook.status"
                      (change)="updateBookStatus(userBook.id, $event)"
                      class="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="to-read">Want to Read</option>
                      <option value="reading">Currently Reading</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex space-x-2">
                    <a 
                      [routerLink]="['/books', userBook.book.id]"
                      class="flex-1 text-center text-sm bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      View Details
                    </a>
                    <button 
                      (click)="removeFromLibrary(userBook.id, userBook.book.title)"
                      class="text-sm text-red-600 hover:text-red-700 px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ng-template #noBooksFound>
            <div class="card p-12 text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ getEmptyStateMessage() }}
              </h3>
              <p class="text-gray-600 mb-4">{{ getEmptyStateDescription() }}</p>
              <a routerLink="/books" class="btn-primary">
                Discover Books
              </a>
            </div>
          </ng-template>
        </div>

        <ng-template #loadingBooks>
          <app-loading-spinner message="Loading your library..."></app-loading-spinner>
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
export class MyLibraryComponent implements OnInit {
  statusFilter = new FormControl('all');
  userBooks$: Observable<UserBook[]>;
  filteredBooks$: Observable<UserBook[]>;
  successMessage = '';

  statusTabs = [
    { value: 'all', label: 'All Books' },
    { value: 'to-read', label: 'Want to Read' },
    { value: 'reading', label: 'Currently Reading' },
    { value: 'completed', label: 'Completed' }
  ];

  constructor(private bookService: BookService) {
    this.userBooks$ = this.bookService.getUserBooks();
    
    this.filteredBooks$ = combineLatest([
      this.userBooks$,
      this.statusFilter.valueChanges.pipe(startWith('all'))
    ]).pipe(
      map(([books, status]) => {
        if (status === 'all') {
          return books;
        }
        return books.filter(book => book.status === status);
      })
    );
  }

  ngOnInit(): void {}

  getTabClass(status: string): string {
    const currentStatus = this.statusFilter.value;
    if (currentStatus === status) {
      return 'border-primary-500 text-primary-600';
    }
    return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  getBookCountForStatus(status: string): Observable<number> {
    return this.userBooks$.pipe(
      map(books => {
        if (status === 'all') {
          return books.length;
        }
        return books.filter(book => book.status === status).length;
      })
    );
  }

  updateBookStatus(userBookId: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newStatus = target.value as ReadingStatus;
    
    this.bookService.updateBookStatus(userBookId, newStatus).subscribe({
      next: (updatedBook) => {
        const statusText = newStatus === 'to-read' ? 'Want to Read' : 
                          newStatus === 'reading' ? 'Currently Reading' : 'Completed';
        this.successMessage = `Updated "${updatedBook.book.title}" status to ${statusText}!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error updating book status:', error);
      }
    });
  }

  removeFromLibrary(userBookId: string, bookTitle: string): void {
    if (confirm(`Are you sure you want to remove "${bookTitle}" from your library?`)) {
      this.bookService.removeBookFromLibrary(userBookId).subscribe({
        next: () => {
          this.successMessage = `Removed "${bookTitle}" from your library.`;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error removing book from library:', error);
        }
      });
    }
  }

  getEmptyStateMessage(): string {
    const status = this.statusFilter.value;
    switch (status) {
      case 'to-read':
        return 'No books in your "Want to Read" list';
      case 'reading':
        return 'No books currently being read';
      case 'completed':
        return 'No completed books yet';
      default:
        return 'Your library is empty';
    }
  }

  getEmptyStateDescription(): string {
    const status = this.statusFilter.value;
    switch (status) {
      case 'to-read':
        return 'Add books you want to read in the future.';
      case 'reading':
        return 'Start reading a book to see your progress here.';
      case 'completed':
        return 'Mark books as completed when you finish reading them.';
      default:
        return 'Start building your personal library by adding books.';
    }
  }

  trackByUserBookId(index: number, userBook: UserBook): string {
    return userBook.id;
  }
}