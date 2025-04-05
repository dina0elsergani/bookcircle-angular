import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Review } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsSubject = new BehaviorSubject<Review[]>([]);
  public reviews$ = this.reviewsSubject.asObservable();

  private mockReviews: Review[] = [
    {
      id: '1',
      userId: '1',
      bookId: '1',
      user: {
        username: 'bookworm_demo',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
      },
      book: {
        id: '1',
        title: 'The Midnight Library',
        author: 'Matt Haig',
        description: '',
        coverUrl: '',
        genre: [],
        averageRating: 0,
        ratingsCount: 0,
        language: 'English'
      },
      rating: 5,
      title: 'A Beautiful Exploration of Life\'s Possibilities',
      content: 'This book completely changed my perspective on life and the choices we make. Matt Haig\'s writing is both philosophical and accessible, making complex ideas about regret and possibility feel tangible. The concept of the midnight library is brilliant.',
      dateCreated: new Date('2024-01-15'),
      likesCount: 23,
      isLikedByCurrentUser: true
    },
    {
      id: '2',
      userId: '2',
      bookId: '2',
      user: {
        username: 'scifi_reader',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
      },
      book: {
        id: '2',
        title: 'Dune',
        author: 'Frank Herbert',
        description: '',
        coverUrl: '',
        genre: [],
        averageRating: 0,
        ratingsCount: 0,
        language: 'English'
      },
      rating: 5,
      title: 'A Masterpiece of Science Fiction',
      content: 'Dune is not just a book; it\'s an entire world. Herbert\'s world-building is unparalleled, and the political intrigue keeps you engaged throughout. A must-read for any sci-fi fan.',
      dateCreated: new Date('2024-01-10'),
      likesCount: 45,
      isLikedByCurrentUser: false
    }
  ];

  constructor() {
    this.reviewsSubject.next(this.mockReviews);
  }

  getReviewsByBookId(bookId: string): Observable<Review[]> {
    return of(this.mockReviews.filter(review => review.bookId === bookId)).pipe(delay(300));
  }

  getReviewsByUserId(userId: string): Observable<Review[]> {
    return of(this.mockReviews.filter(review => review.userId === userId)).pipe(delay(300));
  }

  getAllReviews(): Observable<Review[]> {
    return this.reviews$;
  }

  createReview(bookId: string, rating: number, title: string, content: string): Observable<Review> {
    const newReview: Review = {
      id: Math.random().toString(36).substring(7),
      userId: '1',
      bookId,
      user: {
        username: 'bookworm_demo',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face'
      },
      book: {
        id: bookId,
        title: '',
        author: '',
        description: '',
        coverUrl: '',
        genre: [],
        averageRating: 0,
        ratingsCount: 0,
        language: 'English'
      },
      rating,
      title,
      content,
      dateCreated: new Date(),
      likesCount: 0,
      isLikedByCurrentUser: false
    };

    return of(newReview).pipe(
      delay(500),
      map(review => {
        const currentReviews = this.reviewsSubject.value;
        currentReviews.push(review);
        this.reviewsSubject.next([...currentReviews]);
        return review;
      })
    );
  }

  updateReview(reviewId: string, rating: number, title: string, content: string): Observable<Review> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const currentReviews = this.reviewsSubject.value;
        const reviewIndex = currentReviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex >= 0) {
          const updatedReview = {
            ...currentReviews[reviewIndex],
            rating,
            title,
            content,
            dateUpdated: new Date()
          };
          
          currentReviews[reviewIndex] = updatedReview;
          this.reviewsSubject.next([...currentReviews]);
          return updatedReview;
        }
        
        throw new Error('Review not found');
      })
    );
  }

  deleteReview(reviewId: string): Observable<void> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const currentReviews = this.reviewsSubject.value;
        const filteredReviews = currentReviews.filter(r => r.id !== reviewId);
        this.reviewsSubject.next(filteredReviews);
      })
    );
  }

  toggleReviewLike(reviewId: string): Observable<Review> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const currentReviews = this.reviewsSubject.value;
        const reviewIndex = currentReviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex >= 0) {
          const review = currentReviews[reviewIndex];
          const updatedReview = {
            ...review,
            isLikedByCurrentUser: !review.isLikedByCurrentUser,
            likesCount: review.isLikedByCurrentUser ? review.likesCount - 1 : review.likesCount + 1
          };
          
          currentReviews[reviewIndex] = updatedReview;
          this.reviewsSubject.next([...currentReviews]);
          return updatedReview;
        }
        
        throw new Error('Review not found');
      })
    );
  }
}