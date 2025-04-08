import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p class="mt-2 text-sm text-gray-600">
            Sign in to your BookCircle account
          </p>
        </div>

        <div class="bg-white py-8 px-6 shadow-lg rounded-xl">
          <!-- Demo credentials info -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 class="text-sm font-medium text-blue-800 mb-2">Demo Account</h3>
            <p class="text-xs text-blue-600 mb-2">Use these credentials to explore the app:</p>
            <div class="text-xs text-blue-700 font-mono">
              <div>Email: demo&#64;bookcircle.com</div>
              <div>Password: demo123</div>
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input"
                placeholder="Enter your email address"
                [class.border-red-500]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              />
              <div 
                *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                class="mt-1 text-sm text-red-600"
              >
                Please enter a valid email address
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="input"
                placeholder="Enter your password"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              />
              <div 
                *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                class="mt-1 text-sm text-red-600"
              >
                Password is required
              </div>
            </div>

            <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>

            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              <span *ngIf="!isLoading">Sign In</span>
              <app-loading-spinner 
                *ngIf="isLoading" 
                size="sm" 
                [center]="false"
              ></app-loading-spinner>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <a routerLink="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['demo@bookcircle.com', [Validators.required, Validators.email]],
      password: ['demo123', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}