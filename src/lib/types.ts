export interface Flashcard {
  id: string;
  topic: string; // Category or Deck Name
  question: string;
  answer: string;
  // Spaced repetition fields
  interval: number; // in days
  repetition: number; // n-th repetition
  efactor: number; // easiness factor (SM-2 algorithm)
  dueDate: string; // ISO string date for next review
  lastReviewed: string | null; // ISO string date of last review
  createdAt: string; // ISO string date
}

export type CardQuality = 0 | 1 | 2 | 3 | 4 | 5;

// For chart data
export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  reviewedCount: number;
  newCount: number;
}

// Type for data when adding a new flashcard
export type AddFlashcardData = Pick<Flashcard, 'topic' | 'question' | 'answer'> & {
  dueDate?: string; // Optional initial due date
};
