import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Book, UserBook, ReadingStatus, BookSearchFilters } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksSubject = new BehaviorSubject<Book[]>([]);
  public books$ = this.booksSubject.asObservable();
  
  private userBooksSubject = new BehaviorSubject<UserBook[]>([]);
  public userBooks$ = this.userBooksSubject.asObservable();

  private mockBooks: Book[] = [
    {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
      genre: ['Fiction', 'Philosophy'],
      averageRating: 4.2,
      ratingsCount: 1247,
      pageCount: 288,
      language: 'English',
      publishedDate: new Date('2020-08-13')
    },
    {
      id: '2',
      title: 'Dune',
      author: 'Frank Herbert',
      description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
      coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop',
      genre: ['Science Fiction', 'Adventure'],
      averageRating: 4.6,
      ratingsCount: 2156,
      pageCount: 688,
      language: 'English',
      publishedDate: new Date('1965-08-01')
    },
    {
      id: '3',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      description: 'Reclusive Hollywood icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
      coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
      genre: ['Historical Fiction', 'Romance'],
      averageRating: 4.5,
      ratingsCount: 3421,
      pageCount: 400,
      language: 'English',
      publishedDate: new Date('2017-06-13')
    },
    {
      id: '4',
      title: 'Educated',
      author: 'Tara Westover',
      description: 'Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom.',
      coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
      genre: ['Memoir', 'Biography'],
      averageRating: 4.4,
      ratingsCount: 1876,
      pageCount: 334,
      language: 'English',
      publishedDate: new Date('2018-02-20')
    },
    {
      id: '5',
      title: 'The Silent Patient',
      author: 'Alex Michaelides',
      description: 'The Silent Patient is a shocking psychological thriller of a woman\'s act of violence against her husband―and of the therapist obsessed with uncovering her motive.',
      coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
      genre: ['Thriller', 'Mystery'],
      averageRating: 4.1,
      ratingsCount: 2934,
      pageCount: 336,
      language: 'English',
      publishedDate: new Date('2019-02-05')
    },
    {
      id: '6',
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. No matter your goals, Atomic Habits offers a proven framework for improving--every day.',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
      genre: ['Self-Help', 'Psychology'],
      averageRating: 4.7,
      ratingsCount: 4521,
      pageCount: 320,
      language: 'English',
      publishedDate: new Date('2018-10-16')
    }
  ];

  constructor() {
    this.booksSubject.next(this.mockBooks);
    this.loadUserBooks();
  }

  getBooks(filters?: BookSearchFilters): Observable<Book[]> {
    return of(this.mockBooks).pipe(
      delay(300),
      map(books => {
        let filteredBooks = [...books];
        
        if (filters?.query) {
          const query = filters.query.toLowerCase();
          filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
          );
        }
        
        if (filters?.genre) {
          filteredBooks = filteredBooks.filter(book =>
            book.genre.includes(filters.genre!)
          );
        }
        
        if (filters?.minRating) {
          filteredBooks = filteredBooks.filter(book =>
            book.averageRating >= filters.minRating!
          );
        }
        
        // Sort books
        if (filters?.sortBy) {
          filteredBooks.sort((a, b) => {
            let comparison = 0;
            switch (filters.sortBy) {
              case 'title':
                comparison = a.title.localeCompare(b.title);
                break;
              case 'author':
                comparison = a.author.localeCompare(b.author);
                break;
              case 'rating':
                comparison = a.averageRating - b.averageRating;
                break;
              case 'publishedDate':
                comparison = (a.publishedDate?.getTime() || 0) - (b.publishedDate?.getTime() || 0);
                break;
            }
            return filters.sortOrder === 'desc' ? -comparison : comparison;
          });
        }
        
        return filteredBooks;
      })
    );
  }

  getBookById(id: string): Observable<Book | undefined> {
    return of(this.mockBooks.find(book => book.id === id)).pipe(delay(200));
  }

  getUserBooks(): Observable<UserBook[]> {
    return this.userBooks$;
  }

  addBookToLibrary(bookId: string, status: ReadingStatus): Observable<UserBook> {
    const book = this.mockBooks.find(b => b.id === bookId);
    if (!book) {
      throw new Error('Book not found');
    }

    const userBook: UserBook = {
      id: Math.random().toString(36).substring(7),
      userId: '1',
      bookId,
      book,
      status,
      dateAdded: new Date(),
      ...(status === 'reading' && { dateStarted: new Date() }),
      ...(status === 'completed' && { dateFinished: new Date() })
    };

    return of(userBook).pipe(
      delay(300),
      map(newUserBook => {
        const currentUserBooks = this.userBooksSubject.value;
        const existingIndex = currentUserBooks.findIndex(ub => ub.bookId === bookId);
        
        if (existingIndex >= 0) {
          currentUserBooks[existingIndex] = newUserBook;
        } else {
          currentUserBooks.push(newUserBook);
        }
        
        this.userBooksSubject.next([...currentUserBooks]);
        this.saveUserBooks(currentUserBooks);
        return newUserBook;
      })
    );
  }

  updateBookStatus(userBookId: string, status: ReadingStatus): Observable<UserBook> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const currentUserBooks = this.userBooksSubject.value;
        const userBookIndex = currentUserBooks.findIndex(ub => ub.id === userBookId);
        
        if (userBookIndex >= 0) {
          const updatedUserBook = {
            ...currentUserBooks[userBookIndex],
            status,
            ...(status === 'reading' && !currentUserBooks[userBookIndex].dateStarted && { dateStarted: new Date() }),
            ...(status === 'completed' && { dateFinished: new Date() })
          };
          
          currentUserBooks[userBookIndex] = updatedUserBook;
          this.userBooksSubject.next([...currentUserBooks]);
          this.saveUserBooks(currentUserBooks);
          return updatedUserBook;
        }
        
        throw new Error('User book not found');
      })
    );
  }

  removeBookFromLibrary(userBookId: string): Observable<void> {
    return of(null).pipe(
      delay(200),
      map(() => {
        const currentUserBooks = this.userBooksSubject.value;
        const filteredBooks = currentUserBooks.filter(ub => ub.id !== userBookId);
        this.userBooksSubject.next(filteredBooks);
        this.saveUserBooks(filteredBooks);
      })
    );
  }

  private loadUserBooks(): void {
    const stored = localStorage.getItem('userBooks');
    if (stored) {
      const userBooks = JSON.parse(stored);
      this.userBooksSubject.next(userBooks);
    }
  }

  private saveUserBooks(userBooks: UserBook[]): void {
    localStorage.setItem('userBooks', JSON.stringify(userBooks));
  }
}