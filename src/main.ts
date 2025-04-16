import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './app/layout/header/header.component';
import { AuthGuard } from './app/core/guards/auth.guard';

// Import all components
import { HomeComponent } from './app/features/home/home.component';
import { LoginComponent } from './app/features/auth/login/login.component';
import { RegisterComponent } from './app/features/auth/register/register.component';
import { DashboardComponent } from './app/features/dashboard/dashboard.component';
import { BookListComponent } from './app/features/books/book-list/book-list.component';
import { BookDetailComponent } from './app/features/books/book-detail/book-detail.component';
import { MyLibraryComponent } from './app/features/library/my-library/my-library.component';
import { ReviewListComponent } from './app/features/reviews/review-list/review-list.component';
import { ProfileComponent } from './app/features/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {}

const routes = [
  { path: '', component: HomeComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'my-library', component: MyLibraryComponent, canActivate: [AuthGuard] },
  { path: 'reviews', component: ReviewListComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));