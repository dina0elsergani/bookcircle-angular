import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/book.model';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RouterModule, StarRatingComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Book Reviews</h1>
          <p class="text-gray-600">Discover what fellow readers think about their latest reads</p>
        </div>

        <!-- Reviews List -->
        <div *ngIf="reviews$ | async as reviews; else loadingReviews">
          <div *ngIf="reviews.length > 0; else noReviews" class="space-y-6">
            <article 
              *ngFor="let review of reviews; trackBy: trackByReviewId"
              class="card p-6 hover:shadow-lg transition-all duration-300 animate-fade-in"
            >
              <!-- Review Header -->
              <div class="flex items-start space-x-4 mb-4">
                <div class="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-sm text-white font-medium">
                    {{ review.user.username.charAt(0).toUpperCase() }}
                  </span>
                </div>
                
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="font-medium text-gray-900">{{ review.user.username }}</h3>
                    <app-star-rating [rating]="review.rating" [readonly]="true"></app-star-rating>
                    <span class="text-sm text-gray-500">{{ review.dateCreated | date:'mediumDate' }}</span>
                  </div>
                  
                  <div class="flex items-center space-x-2 text-sm text-gray-600">
                    <span>reviewed</span>
                    <a 
                      [routerLink]="['/books', review.book.id]"
                      class="font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                    >
                      {{ review.book.title }}
                    </a>
                    <span>by {{ review.book.author }}</span>
                  </div>
                </div>
              </div>

              <!-- Review Content -->
              <div class="mb-4">
                <h4 class="font-semibold text-lg text-gray-900 mb-2">{{ review.title }}</h4>
                <p class="text-gray-700 leading-relaxed">{{ review.content }}</p>
              </div>

              <!-- Review Footer -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="flex items-center space-x-4">
                  <button 
                    (click)="toggleReviewLike(review.id)"
                    class="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                  >
                    <svg 
                      class="w-5 h-5" 
                      [class.text-red-500]="review.isLikedByCurrentUser"
                      [attr.fill]="review.isLikedByCurrentUser ? 'currentColor' : 'none'"
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span>{{ review.likesCount }} {{ review.likesCount === 1 ? 'like' : 'likes' }}</span>
                  </button>

                  <span class="text-gray-300">•</span>

                  <a 
                    [routerLink]="['/books', review.book.id]"
                    class="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    View Book
                  </a>
                </div>

                <div *ngIf="review.dateUpdated" class="text-xs text-gray-500">
                  Updated {{ review.dateUpdated | date:'shortDate' }}
                </div>
              </div>
            </article>
          </div>

          <ng-template #noReviews>
            <div class="card p-12 text-center">
              <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p class="text-gray-600 mb-4">Be the first to share your thoughts about a book!</p>
              <a routerLink="/books" class="btn-primary">
                Discover Books to Review
              </a>
            </div>
          </ng-template>
        </div>

        <ng-template #loadingReviews>
          <app-loading-spinner message="Loading reviews..."></app-loading-spinner>
        </ng-template>
      </div>
    </div>
  `
})
export class ReviewListComponent implements OnInit {
  reviews$: Observable<Review[]>;

  constructor(private reviewService: ReviewService) {
    this.reviews$ = this.reviewService.getAllReviews();
  }

  ngOnInit(): void {}

  toggleReviewLike(reviewId: string): void {
    this.reviewService.toggleReviewLike(reviewId).subscribe({
      error: (error) => {
        console.error('Error toggling review like:', error);
      }
    });
  }

  trackByReviewId(index: number, review: Review): string {
    return review.id;
  }
}