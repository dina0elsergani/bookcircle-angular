import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-xl font-bold text-gray-900">BookCircle</span>
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a 
              routerLink="/books" 
              routerLinkActive="text-primary-600 border-primary-600"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent transition-colors duration-200"
            >
              Discover
            </a>
            <a 
              routerLink="/my-library" 
              routerLinkActive="text-primary-600 border-primary-600"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent transition-colors duration-200"
              *ngIf="isAuthenticated$ | async"
            >
              My Library
            </a>
            <a 
              routerLink="/reviews" 
              routerLinkActive="text-primary-600 border-primary-600"
              class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium border-b-2 border-transparent transition-colors duration-200"
              *ngIf="isAuthenticated$ | async"
            >
              Reviews
            </a>
          </nav>

          <!-- User menu -->
          <div class="flex items-center space-x-4">
            <div *ngIf="currentUser$ | async as user; else loginButton" class="relative">
              <button 
                (click)="toggleUserMenu()"
                class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span class="text-sm text-white font-medium">
                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                  </span>
                </div>
                <span class="hidden sm:block text-sm font-medium text-gray-700">
                  {{ user.firstName }}
                </span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div 
                *ngIf="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <a 
                  routerLink="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  (click)="toggleUserMenu()"
                >
                  View Profile
                </a>
                <a 
                  routerLink="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  (click)="toggleUserMenu()"
                >
                  Settings
                </a>
                <div class="border-t border-gray-100 my-1"></div>
                <button 
                  (click)="logout()"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>

            <ng-template #loginButton>
              <div class="flex items-center space-x-2">
                <a routerLink="/auth/login" class="btn-secondary text-sm">Sign In</a>
                <a routerLink="/auth/register" class="btn-primary text-sm">Sign Up</a>
              </div>
            </ng-template>

            <!-- Mobile menu button -->
            <button 
              (click)="toggleMobileMenu()"
              class="md:hidden p-2 rounded-lg hover:bg-gray-50"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile navigation -->
        <div *ngIf="showMobileMenu" class="md:hidden py-4 border-t border-gray-200">
          <div class="flex flex-col space-y-2">
            <a 
              routerLink="/books"
              class="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              (click)="toggleMobileMenu()"
            >
              Discover
            </a>
            <a 
              routerLink="/my-library"
              class="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              (click)="toggleMobileMenu()"
              *ngIf="isAuthenticated$ | async"
            >
              My Library
            </a>
            <a 
              routerLink="/reviews"
              class="px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg"
              (click)="toggleMobileMenu()"
              *ngIf="isAuthenticated$ | async"
            >
              Reviews
            </a>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  showUserMenu = false;
  showMobileMenu = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    // Close menus when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.showUserMenu = false;
      }
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showMobileMenu = false;
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }
}