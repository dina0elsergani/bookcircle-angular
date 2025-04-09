import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <!-- Hero Section -->
      <section class="relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Welcome to
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                BookCircle
              </span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
              Your social reading platform where book lovers connect, share reviews, and discover their next great read. 
              Track your reading journey and join a community of passionate readers.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
              <a 
                *ngIf="!(isAuthenticated$ | async); else authenticatedButtons"
                routerLink="/auth/register" 
                class="btn-primary text-lg px-8 py-4"
              >
                Join BookCircle
              </a>
              <ng-template #authenticatedButtons>
                <a routerLink="/dashboard" class="btn-primary text-lg px-8 py-4">
                  Go to Dashboard
                </a>
              </ng-template>
              <a routerLink="/books" class="btn-secondary text-lg px-8 py-4">
                Discover Books
              </a>
            </div>
          </div>
        </div>

        <!-- Decorative elements -->
        <div class="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-50 animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-30 animate-pulse" style="animation-delay: 1s;"></div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Your Reading Journey</h2>
            <p class="text-xl text-gray-600">Powerful features to enhance your reading experience</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-300">
                <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Personal Library</h3>
              <p class="text-gray-600">Organize your books into "Want to Read", "Currently Reading", and "Completed" lists. Track your reading progress effortlessly.</p>
            </div>

            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors duration-300">
                <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
              <p class="text-gray-600">Share your thoughts with detailed reviews and star ratings. Help other readers discover their next favorite book.</p>
            </div>

            <div class="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group">
              <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors duration-300">
                <svg class="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Smart Discovery</h3>
              <p class="text-gray-600">Find books by title, author, or genre. Filter by ratings and sort by various criteria to discover your perfect read.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Join Our Growing Community</h2>
            <p class="text-xl text-gray-600">Be part of a thriving community of book enthusiasts</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div class="text-gray-600">Books in Library</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-secondary-600 mb-2">5K+</div>
              <div class="text-gray-600">Active Readers</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-accent-600 mb-2">25K+</div>
              <div class="text-gray-600">Reviews Written</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-green-600 mb-2">100K+</div>
              <div class="text-gray-600">Books Read</div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 class="text-3xl font-bold text-white mb-4">Ready to Start Your Reading Journey?</h2>
          <p class="text-xl text-primary-100 mb-8">
            Join thousands of readers who have already discovered their next favorite book on BookCircle.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              *ngIf="!(isAuthenticated$ | async)"
              routerLink="/auth/register" 
              class="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Get Started Free
            </a>
            <a 
              routerLink="/books" 
              class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              Browse Books
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }
}