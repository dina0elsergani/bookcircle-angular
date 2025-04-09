import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';
import { ReviewService } from '../../core/services/review.service';
import { User } from '../../core/models/user.model';
import { UserBook, Review, Book } from '../../core/models/book.model';
import { BookCardComponent } from '../../shared/components/book-card/book-card.component';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BookCardComponent, StarRatingComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Welcome Header -->
        <div *ngIf="currentUser$ | async as user" class="mb-8">
          <div class="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
            <h1 class="text-2xl font-bold mb-2">Welcome back, {{ user.firstName }}!</h1>
            <p class="text-primary-100">Continue your reading journey and discover new books.</p>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div *ngIf="currentUser$ | async as user" class="card p-6 text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">{{ user.readingStats.booksRead }}</div>
            <div class="text-sm text-gray-600">Books Read</div>
          </div>
          <div *ngIf="currentUser$ | async as user" class="card p-6 text-center">
            <div class="text-3xl font-bold text-secondary-600 mb-2">{{ user.readingStats.currentlyReading }}</div>
            <div class="text-sm text-gray-600">Currently Reading</div>
          </div>
          <div *ngIf="currentUser$ | async as user" class="card p-6 text-center">
            <div class="text-3xl font-bold text-accent-600 mb-2">{{ user.readingStats.reviewsWritten }}</div>
            <div class="text-sm text-gray-600">Reviews Written</div>
          </div>
          <div *ngIf="currentUser$ | async as user" class="card p-6 text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">{{ user.readingStats.pagesRead | number }}</div>
            <div class="text-sm text-gray-600">Pages Read</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Currently Reading -->
          <div class="lg:col-span-2">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-900">Currently Reading</h2>
              <a routerLink="/my-library" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All →
              </a>
            </div>

            <div *ngIf="currentlyReading$ | async as books; else loadingBooks">
              <div *ngIf="books.length > 0; else noCurrentBooks" class="space-y-4">
                <div *ngFor="let userBook of books" class="card p-4 flex items-center space-x-4">
                  <img [src]="userBook.book.coverUrl" [alt]="userBook.book.title" class="w-16 h-24 object-cover rounded">
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ userBook.book.title }}</h3>
                    <p class="text-gray-600 text-sm mb-2">by {{ userBook.book.author }}</p>
                    <div class="flex items-center space-x-4">
                      <div class="text-xs text-gray-500">
                        Started {{ userBook.dateStarted | date:'mediumDate' }}
                      </div>
                      <a [routerLink]="['/books', userBook.book.id]" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                        Continue Reading
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <ng-template #noCurrentBooks>
                <div class="card p-8 text-center">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No books in progress</h3>
                  <p class="text-gray-600 mb-4">Start reading a book to see your progress here.</p>
                  <a routerLink="/books" class="btn-primary">Discover Books</a>
                </div>
              </ng-template>
            </div>

            <ng-template #loadingBooks>
              <app-loading-spinner message="Loading your books..."></app-loading-spinner>
            </ng-template>
          </div>

          <!-- Recent Activity & Recommendations -->
          <div class="space-y-8">
            <!-- Recent Reviews -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900">Recent Reviews</h2>
                <a routerLink="/reviews" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All →
                </a>
              </div>

              <div *ngIf="recentReviews$ | async as reviews; else loadingReviews">
                <div *ngIf="reviews.length > 0; else noReviews" class="space-y-4">
                  <div *ngFor="let review of reviews.slice(0, 3)" class="card p-4">
                    <div class="flex items-center space-x-3 mb-3">
                      <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span class="text-xs text-white font-medium">
                          {{ review.user.username.charAt(0).toUpperCase() }}
                        </span>
                      </div>
                      <div>
                        <div class="font-medium text-sm text-gray-900">{{ review.user.username }}</div>
                        <div class="text-xs text-gray-500">{{ review.dateCreated | date:'shortDate' }}</div>
                      </div>
                    </div>
                    <div class="mb-2">
                      <app-star-rating [rating]="review.rating" [readonly]="true" [showRating]="false"></app-star-rating>
                    </div>
                    <h4 class="font-medium text-sm text-gray-900 mb-1">{{ review.title }}</h4>
                    <p class="text-xs text-gray-600 line-clamp-2">{{ review.content }}</p>
                  </div>
                </div>

                <ng-template #noReviews>
                  <div class="card p-6 text-center">
                    <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <p class="text-sm text-gray-600">No reviews yet</p>
                  </div>
                </ng-template>
              </div>

              <ng-template #loadingReviews>
                <app-loading-spinner size="sm"></app-loading-spinner>
              </ng-template>
            </div>

            <!-- Recommended Books -->
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
              <div *ngIf="recommendedBooks$ | async as books">
                <div class="space-y-3">
                  <div *ngFor="let book of books.slice(0, 3)" class="card p-3 flex items-center space-x-3">
                    <img [src]="book.coverUrl" [alt]="book.title" class="w-12 h-16 object-cover rounded">
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-sm text-gray-900 truncate">{{ book.title }}</h4>
                      <p class="text-xs text-gray-600 truncate">{{ book.author }}</p>
                      <app-star-rating [rating]="book.averageRating" [readonly]="true" [showRating]="false" class="mt-1"></app-star-rating>
                    </div>
                    <a [routerLink]="['/books', book.id]" class="text-primary-600 hover:text-primary-700">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
export class DashboardComponent implements OnInit {
  currentUser$: Observable<User | null>;
  currentlyReading$: Observable<UserBook[]>;
  recentReviews$: Observable<Review[]>;
  recommendedBooks$: Observable<Book[]>;

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private reviewService: ReviewService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.currentlyReading$ = this.bookService.getUserBooks().pipe(
      map(books => books.filter(book => book.status === 'reading'))
    );
    this.recentReviews$ = this.reviewService.getAllReviews();
    this.recommendedBooks$ = this.bookService.getBooks({ sortBy: 'rating', sortOrder: 'desc' });
  }

  ngOnInit(): void {}
}