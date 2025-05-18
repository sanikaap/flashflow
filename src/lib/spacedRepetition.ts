import type { Flashcard, CardQuality } from './types';
import { addDays, formatISO, parseISO, startOfDay } from 'date-fns';

const MIN_EFACTOR = 1.3;

export function calculateSpacedRepetition(
  card: Flashcard,
  quality: CardQuality // 0-5, where 5 is perfect recall
): Flashcard {
  let { efactor, repetition, interval } = card;

  if (quality < 3) {
    // Failed recall: reset repetition and interval
    repetition = 0;
    interval = 1; // Show again tomorrow
  } else {
    // Successful recall
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition += 1;
  }

  // Update efactor
  efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (efactor < MIN_EFACTOR) {
    efactor = MIN_EFACTOR;
  }

  const newDueDate = addDays(new Date(), interval);

  return {
    ...card,
    efactor,
    repetition,
    interval,
    dueDate: formatISO(newDueDate),
    lastReviewed: formatISO(new Date()),
  };
}

// Helper to get initial SM-2 values for a new card
export function getInitialSM2Data(): Pick<Flashcard, 'interval' | 'repetition' | 'efactor' | 'dueDate' | 'lastReviewed' | 'createdAt'> {
  const now = new Date();
  return {
    interval: 0,
    repetition: 0,
    efactor: 2.5, // Default starting E-Factor
    dueDate: formatISO(startOfDay(now)), // Due today (ensures it's caught by getDueCards)
    lastReviewed: null,
    createdAt: formatISO(now),
  };
}
