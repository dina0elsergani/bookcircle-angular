export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  isbn?: string;
  publishedDate?: Date;
  pageCount?: number;
  genre: string[];
  averageRating: number;
  ratingsCount: number;
  language: string;
}

export interface UserBook {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  status: ReadingStatus;
  dateAdded: Date;
  dateStarted?: Date;
  dateFinished?: Date;
  currentPage?: number;
  notes?: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  user: {
    username: string;
    avatarUrl?: string;
  };
  book: Book;
  rating: number;
  title: string;
  content: string;
  dateCreated: Date;
  dateUpdated?: Date;
  likesCount: number;
  isLikedByCurrentUser?: boolean;
}

export type ReadingStatus = 'to-read' | 'reading' | 'completed';

export interface BookSearchFilters {
  query?: string;
  genre?: string;
  author?: string;
  minRating?: number;
  sortBy?: 'title' | 'author' | 'rating' | 'publishedDate';
  sortOrder?: 'asc' | 'desc';
}