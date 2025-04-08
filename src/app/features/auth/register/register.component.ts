import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register',
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
          <h2 class="text-3xl font-bold text-gray-900">Join BookCircle</h2>
          <p class="mt-2 text-sm text-gray-600">
            Create your account and start your reading journey
          </p>
        </div>

        <div class="bg-white py-8 px-6 shadow-lg rounded-xl">
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  formControlName="firstName"
                  class="input"
                  placeholder="First name"
                  [class.border-red-500]="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                />
                <div 
                  *ngIf="registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched"
                  class="mt-1 text-sm text-red-600"
                >
                  First name is required
                </div>
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  formControlName="lastName"
                  class="input"
                  placeholder="Last name"
                  [class.border-red-500]="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                />
                <div 
                  *ngIf="registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched"
                  class="mt-1 text-sm text-red-600"
                >
                  Last name is required
                </div>
              </div>
            </div>

            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                formControlName="username"
                class="input"
                placeholder="Choose a username"
                [class.border-red-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
              />
              <div 
                *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                class="mt-1 text-sm text-red-600"
              >
                Username is required (minimum 3 characters)
              </div>
            </div>

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
                [class.border-red-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
              />
              <div 
                *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
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
                placeholder="Create a password"
                [class.border-red-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
              />
              <div 
                *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                class="mt-1 text-sm text-red-600"
              >
                Password must be at least 6 characters long
              </div>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="input"
                placeholder="Confirm your password"
                [class.border-red-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
              />
              <div 
                *ngIf="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                class="mt-1 text-sm text-red-600"
              >
                Passwords do not match
              </div>
            </div>

            <div *ngIf="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{ errorMessage }}</p>
            </div>

            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              <span *ngIf="!isLoading">Create Account</span>
              <app-loading-spinner 
                *ngIf="isLoading" 
                size="sm" 
                [center]="false"
              ></app-loading-spinner>
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <a routerLink="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { confirmPassword, ...userData } = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}