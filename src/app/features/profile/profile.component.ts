import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service';
import { ReviewService } from '../../core/services/review.service';
import { User } from '../../core/models/user.model';
import { UserBook, Review } from '../../core/models/book.model';
import { StarRatingComponent } from '../../shared/components/star-rating/star-rating.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, StarRatingComponent, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div *ngIf="currentUser$ | async as user; else loadingProfile">
          <!-- Profile Header -->
          <div class="card p-8 mb-8">
            <div class="flex items-center space-x-6 mb-6">
              <div class="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                <span class="text-2xl text-white font-bold">
                  {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                </span>
              </div>
              
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  {{ user.firstName }} {{ user.lastName }}
                </h1>
                <p class="text-gray-600 mb-2">&#64;{{ user.username }}</p>
                <p class="text-sm text-gray-500">
                  Member since {{ user.joinedDate | date:'MMMM yyyy' }}
                </p>
                <p *ngIf="user.bio" class="text-gray-700 mt-3">{{ user.bio }}</p>
              </div>

              <button 
                (click)="showEditForm = !showEditForm"
                class="btn-primary"
              >
                {{ showEditForm ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>

            <!-- Favorite Genres -->
            <div *ngIf="user.favoriteGenres.length > 0" class="mb-6">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Favorite Genres</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  *ngFor="let genre of user.favoriteGenres"
                  class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                >
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Edit Form -->
            <div *ngIf="showEditForm" class="mt-6 pt-6 border-t border-gray-200">
              <form [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      formControlName="firstName"
                      class="input"
                    />
                  </div>
                  <div>
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      formControlName="lastName"
                      class="input"
                    />
                  </div>
                </div>

                <div>
                  <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    formControlName="bio"
                    rows="3"
                    class="input"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                <div class="flex space-x-3">
                  <button 
                    type="submit"
                    [disabled]="profileForm.invalid || isUpdating"
                    class="btn-primary disabled:opacity-50"
                  >
                    <span *ngIf="!isUpdating">Save Changes</span>
                    <app-loading-spinner 
                      *ngIf="isUpdating" 
                      size="sm" 
                      [center]="false"
                    ></app-loading-spinner>
                  </button>
                  <button 
                    type="button"
                    (click)="showEditForm = false"
                    class="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Reading Statistics -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">{{ user.readingStats.booksRead }}</div>
              <div class="text-sm text-gray-600">Books Read</div>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-secondary-600 mb-2">{{ user.readingStats.currentlyReading }}</div>
              <div class="text-sm text-gray-600">Currently Reading</div>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-accent-600 mb-2">{{ user.readingStats.reviewsWritten }}</div>
              <div class="text-sm text-gray-600">Reviews Written</div>
            </div>
            <div class="card p-6 text-center">
              <div class="text-3xl font-bold text-green-600 mb-2">{{ user.readingStats.pagesRead | number }}</div>
              <div class="text-sm text-gray-600">Pages Read</div>
            </div>
          </div>

          <!-- Recent Activity Tabs -->
          <div class="card">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex">
                <button
                  (click)="activeTab = 'books'"
                  [class]="getTabClass('books')"
                  class="py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200"
                >
                  Recent Books
                </button>
                <button
                  (click)="activeTab = 'reviews'"
                  [class]="getTabClass('reviews')"
                  class="py-4 px-6 border-b-2 font-medium text-sm transition-colors duration-200"
                >
                  My Reviews
                </button>
              </nav>
            </div>

            <div class="p-6">
              <!-- Recent Books Tab -->
              <div *ngIf="activeTab === 'books'">
                <div *ngIf="recentBooks$ | async as books; else loadingBooks">
                  <div *ngIf="books.length > 0; else noBooks" class="space-y-4">
                    <div 
                      *ngFor="let userBook of books.slice(0, 5)"
                      class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img 
                        [src]="userBook.book.coverUrl" 
                        [alt]="userBook.book.title"
                        class="w-12 h-16 object-cover rounded"
                      />
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">{{ userBook.book.title }}</h4>
                        <p class="text-sm text-gray-600">by {{ userBook.book.author }}</p>
                        <div class="flex items-center space-x-2 mt-1">
                          <span class="text-xs px-2 py-1 rounded-full"
                                [class]="getStatusClass(userBook.status)">
                            {{ getStatusLabel(userBook.status) }}
                          </span>
                          <span class="text-xs text-gray-500">
                            {{ userBook.dateAdded | date:'shortDate' }}
                          </span>
                        </div>
                      </div>
                      <a 
                        [routerLink]="['/books', userBook.book.id]"
                        class="text-primary-600 hover:text-primary-700"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  <ng-template #noBooks>
                    <div class="text-center py-8">
                      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                      <p class="text-gray-600">No books in your library yet</p>
                    </div>
                  </ng-template>
                </div>

                <ng-template #loadingBooks>
                  <app-loading-spinner size="sm"></app-loading-spinner>
                </ng-template>
              </div>

              <!-- Reviews Tab -->
              <div *ngIf="activeTab === 'reviews'">
                <div *ngIf="userReviews$ | async as reviews; else loadingReviews">
                  <div *ngIf="reviews.length > 0; else noReviews" class="space-y-6">
                    <div 
                      *ngFor="let review of reviews.slice(0, 5)"
                      class="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div class="flex items-center space-x-3 mb-3">
                        <app-star-rating [rating]="review.rating" [readonly]="true"></app-star-rating>
                        <span class="text-sm text-gray-500">{{ review.dateCreated | date:'mediumDate' }}</span>
                      </div>
                      <h4 class="font-medium text-gray-900 mb-2">{{ review.title }}</h4>
                      <p class="text-gray-700 text-sm mb-3">{{ review.content }}</p>
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">
                          Review for "{{ review.book.title }}"
                        </span>
                        <div class="flex items-center space-x-2 text-sm text-gray-500">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                          </svg>
                          <span>{{ review.likesCount }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <ng-template #noReviews>
                    <div class="text-center py-8">
                      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <p class="text-gray-600">No reviews written yet</p>
                    </div>
                  </ng-template>
                </div>

                <ng-template #loadingReviews>
                  <app-loading-spinner size="sm"></app-loading-spinner>
                </ng-template>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loadingProfile>
          <app-loading-spinner message="Loading profile..."></app-loading-spinner>
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
export class ProfileComponent implements OnInit {
  currentUser$: Observable<User | null>;
  recentBooks$: Observable<UserBook[]>;
  userReviews$: Observable<Review[]>;
  
  profileForm: FormGroup;
  showEditForm = false;
  isUpdating = false;
  activeTab = 'books';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private reviewService: ReviewService,
    private fb: FormBuilder
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.recentBooks$ = this.bookService.getUserBooks().pipe(
      map(books => books.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()))
    );
    this.userReviews$ = this.reviewService.getReviewsByUserId('1');

    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      bio: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio || ''
        });
      }
    });
  }

  getTabClass(tab: string): string {
    if (this.activeTab === tab) {
      return 'border-primary-500 text-primary-600';
    }
    return 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'to-read':
        return 'bg-blue-100 text-blue-800';
      case 'reading':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'to-read':
        return 'Want to Read';
      case 'reading':
        return 'Reading';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid && !this.isUpdating) {
      this.isUpdating = true;
      
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          ...this.profileForm.value
        };

        this.authService.updateUser(updatedUser).subscribe({
          next: () => {
            this.successMessage = 'Profile updated successfully!';
            this.showEditForm = false;
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            console.error('Error updating profile:', error);
          },
          complete: () => {
            this.isUpdating = false;
          }
        });
      }
    }
  }
}