export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
  joinedDate: Date;
  favoriteGenres: string[];
  readingStats: {
    booksRead: number;
    pagesRead: number;
    reviewsWritten: number;
    currentlyReading: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}