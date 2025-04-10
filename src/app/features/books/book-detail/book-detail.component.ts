import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BookService } from '../../../core/services/book.service';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Book, Review, ReadingStatus } from '../../../core/models/book.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StarRatingComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div *ngIf="book$ | async as book; else loadingBook">
          <!-- Back Navigation -->
          <button 
            (click)="goBack()"
            class="mb-6 flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Books
          </button>

          <!-- Book Details -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div class="lg:col-span-1">
              <div class="card p-6 sticky top-20">
                <img 
                  [src]="book.coverUrl" 
                  [alt]="book.title"
                  class="w-full h-96 object-cover rounded-lg mb-6"
                />
                
                <div class="space-y-4">
                  <button 
                    (click)="addToLibrary('to-read')"
                    class="w-full btn-secondary"
                  >
                    Want to Read
                  </button>
                  <button 
                    (click)="addToLibrary('reading')"
                    class="w-full btn-primary"
                  >
                    Currently Reading
                  </button>
                  <button 
                    (click)="addToLibrary('completed')"
                    class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Mark as Read
                  </button>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2">
              <div class="card p-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
                <p class="text-xl text-gray-600 mb-4">by {{ book.author }}</p>
                
                <div class="flex items-center space-x-6 mb-6">
                  <app-star-rating 
                    [rating]="book.averageRating" 
                    [readonly]="true"
                    [showRating]="true"
                    [reviewCount]="book.ratingsCount"
                  ></app-star-rating>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                  <span 
                    *ngFor="let genre of book.genre"
                    class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                  >
                    {{ genre }}
                  </span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                  <div>
                    <div class="text-gray-500">Pages</div>
                    <div class="font-medium">{{ book.pageCount || 'N/A' }}</div>
                  </div>
                  <div>
                    <div class="text-gray-500">Language</div>
                    <div class="font-medium">{{ book.language }}</div>
                  </div>
                  <div>
                    <div class="text-gray-500">Published</div>
                    <div class="font-medium">{{ book.publishedDate | date:'yyyy' }}</div>
                  </div>
                  <div>
                    <div class="text-gray-500">ISBN</div>
                    <div class="font-medium">{{ book.isbn || 'N/A' }}</div>
                  </div>
                </div>

                <div>
                  <h2 class="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                  <p class="text-gray-700 leading-relaxed">{{ book.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="card p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-semibold text-gray-900">Reviews</h2>
              <button 
                *ngIf="isAuthenticated$ | async"
                (click)="showReviewForm = !showReviewForm"
                class="btn-primary"
              >
                {{ showReviewForm ? 'Cancel' : 'Write Review' }}
              </button>
            </div>

            <!-- Review Form -->
            <div *ngIf="showReviewForm && (isAuthenticated$ | async)" class="mb-8 p-6 bg-gray-50 rounded-lg">
              <form [formGroup]="reviewForm" (ngSubmit)="onSubmitReview()">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                  <app-star-rating 
                    [rating]="reviewForm.get('rating')?.value || 0"
                    (ratingChange)="reviewForm.patchValue({ rating: $event })"
                  ></app-star-rating>
                </div>

                <div class="mb-4">
                  <label for="reviewTitle" class="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <input
                    id="reviewTitle"
                    type="text"
                    formControlName="title"
                    class="input"
                    placeholder="Summarize your thoughts..."
                  />
                </div>

                <div class="mb-4">
                  <label for="reviewContent" class="block text-sm font-medium text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="reviewContent"
                    formControlName="content"
                    rows="4"
                    class="input"
                    placeholder="Share your detailed thoughts about this book..."
                  ></textarea>
                </div>

                <div class="flex space-x-3">
                  <button 
                    type="submit"
                    [disabled]="reviewForm.invalid || isSubmittingReview"
                    class="btn-primary disabled:opacity-50"
                  >
                    <span *ngIf="!isSubmittingReview">Submit Review</span>
                    <app-loading-spinner 
                      *ngIf="isSubmittingReview" 
                      size="sm" 
                      [center]="false"
                    ></app-loading-spinner>
                  </button>
                  <button 
                    type="button"
                    (click)="showReviewForm = false"
                    class="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <!-- Reviews List -->
            <div *ngIf="reviews$ | async as reviews; else loadingReviews">
              <div *ngIf="reviews.length > 0; else noReviews" class="space-y-6">
                <div *ngFor="let review of reviews" class="border-b border-gray-200 pb-6 last:border-b-0">
                  <div class="flex items-start space-x-4">
                    <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="text-sm text-white font-medium">
                        {{ review.user.username.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                    
                    <div class="flex-1">
                      <div class="flex items-center space-x-3 mb-2">
                        <h4 class="font-medium text-gray-900">{{ review.user.username }}</h4>
                        <app-star-rating [rating]="review.rating" [readonly]="true"></app-star-rating>
                        <span class="text-sm text-gray-500">{{ review.dateCreated | date:'mediumDate' }}</span>
                      </div>
                      
                      <h5 class="font-medium text-gray-900 mb-2">{{ review.title }}</h5>
                      <p class="text-gray-700 mb-3">{{ review.content }}</p>
                      
                      <div class="flex items-center space-x-4">
                        <button 
                          (click)="toggleReviewLike(review.id)"
                          class="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                        >
                          <svg 
                            class="w-4 h-4" 
                            [class.text-red-500]="review.isLikedByCurrentUser"
                            [attr.fill]="review.isLikedByCurrentUser ? 'currentColor' : 'none'"
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                          <span>{{ review.likesCount }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <ng-template #noReviews>
                <div class="text-center py-12">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p class="text-gray-600">Be the first to review this book!</p>
                </div>
              </ng-template>
            </div>

            <ng-template #loadingReviews>
              <app-loading-spinner message="Loading reviews..."></app-loading-spinner>
            </ng-template>
          </div>
        </div>

        <ng-template #loadingBook>
          <app-loading-spinner message="Loading book details..."></app-loading-spinner>
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
export class BookDetailComponent implements OnInit {
  book$: Observable<Book | undefined>;
  reviews$: Observable<Review[]>;
  isAuthenticated$: Observable<boolean>;
  
  reviewForm: FormGroup;
  showReviewForm = false;
  isSubmittingReview = false;
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.book$ = this.route.paramMap.pipe(
      switchMap(params => {
        const bookId = params.get('id')!;
        return this.bookService.getBookById(bookId);
      })
    );

    this.reviews$ = this.route.paramMap.pipe(
      switchMap(params => {
        const bookId = params.get('id')!;
        return this.reviewService.getReviewsByBookId(bookId);
      })
    );

    this.isAuthenticated$ = this.authService.isAuthenticated$;

    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {}

  goBack(): void {
    window.history.back();
  }

  addToLibrary(status: ReadingStatus): void {
    const bookId = this.route.snapshot.paramMap.get('id')!;
    
    this.bookService.addBookToLibrary(bookId, status).subscribe({
      next: (userBook) => {
        const statusText = status === 'to-read' ? 'Want to Read' : 
                          status === 'reading' ? 'Currently Reading' : 'Read';
        this.successMessage = `Added "${userBook.book.title}" to ${statusText}!`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        console.error('Error adding book to library:', error);
      }
    });
  }

  onSubmitReview(): void {
    if (this.reviewForm.valid && !this.isSubmittingReview) {
      this.isSubmittingReview = true;
      const bookId = this.route.snapshot.paramMap.get('id')!;
      const { rating, title, content } = this.reviewForm.value;

      this.reviewService.createReview(bookId, rating, title, content).subscribe({
        next: () => {
          this.successMessage = 'Review submitted successfully!';
          this.showReviewForm = false;
          this.reviewForm.reset();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error submitting review:', error);
        },
        complete: () => {
          this.isSubmittingReview = false;
        }
      });
    }
  }

  toggleReviewLike(reviewId: string): void {
    this.reviewService.toggleReviewLike(reviewId).subscribe({
      error: (error) => {
        console.error('Error toggling review like:', error);
      }
    });
  }
}