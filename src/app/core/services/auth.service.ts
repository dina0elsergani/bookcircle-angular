import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadStoredAuth();
  }

  private loadStoredAuth(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Simulate API call
    return of(null).pipe(
      delay(1000),
      map(() => {
        if (credentials.email === 'demo@bookcircle.com' && credentials.password === 'demo123') {
          const user: User = {
            id: '1',
            email: credentials.email,
            username: 'bookworm_demo',
            firstName: 'Demo',
            lastName: 'User',
            bio: 'Passionate reader and book reviewer',
            joinedDate: new Date('2023-01-15'),
            favoriteGenres: ['Fiction', 'Mystery', 'Science Fiction'],
            readingStats: {
              booksRead: 47,
              pagesRead: 12450,
              reviewsWritten: 23,
              currentlyReading: 3
            }
          };
          
          const tokens = {
            accessToken: 'demo-access-token',
            refreshToken: 'demo-refresh-token'
          };
          
          const response: AuthResponse = { user, tokens };
          this.setCurrentUser(user, tokens.accessToken);
          return response;
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Simulate API call
    return of(null).pipe(
      delay(1500),
      map(() => {
        const user: User = {
          id: Math.random().toString(36).substring(7),
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          joinedDate: new Date(),
          favoriteGenres: [],
          readingStats: {
            booksRead: 0,
            pagesRead: 0,
            reviewsWritten: 0,
            currentlyReading: 0
          }
        };
        
        const tokens = {
          accessToken: 'new-user-access-token',
          refreshToken: 'new-user-refresh-token'
        };
        
        const response: AuthResponse = { user, tokens };
        this.setCurrentUser(user, tokens.accessToken);
        return response;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateUser(user: User): Observable<User> {
    return of(user).pipe(
      delay(500),
      map((updatedUser) => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return updatedUser;
      })
    );
  }

  private setCurrentUser(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('accessToken', token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }
}