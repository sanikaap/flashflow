
"use client";

import type { Flashcard, CardQuality, DailyProgress, AddFlashcardData } from '@/lib/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { calculateSpacedRepetition, getInitialSM2Data } from '@/lib/spacedRepetition';
import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { formatISO, parseISO, isToday, startOfDay, format } from 'date-fns';

interface CardDistributionData {
  name: string;
  value: number;
}

interface FlashcardContextType {
  flashcards: Flashcard[];
  addFlashcard: (data: AddFlashcardData) => void;
  updateFlashcard: (id: string, data: Partial<Omit<Flashcard, 'id'>>) => void;
  deleteFlashcard: (id: string) => void;
  getCardById: (id: string) => Flashcard | undefined;
  getDueCards: () => Flashcard[];
  reviewCard: (id: string, quality: CardQuality) => void;
  totalCards: number;
  cardsDueToday: number;
  getTopics: () => string[];
  getProgressData: () => DailyProgress[];
  resetProgress: () => void; // For testing/dev
  getOverallMastery: () => number;
  getCardDistribution: () => CardDistributionData[];
  getTopicMastery: (topicName: string) => number;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

const FLASHCARDS_KEY = 'flashflow_flashcards';
const PROGRESS_KEY = 'flashflow_progress';

const initialMockFlashcardsData: AddFlashcardData[] = [
  { topic: "JavaScript", question: "What is a closure?", answer: "A function that remembers its outer variables and can access them." },
  { topic: "JavaScript", question: "What are the primitive types in JavaScript?", answer: "string, number, bigint, boolean, undefined, symbol, and null." },
  { topic: "CSS", question: "What does CSS stand for?", answer: "Cascading Style Sheets." },
  { topic: "CSS", question: "What is the CSS box model?", answer: "A box that wraps around every HTML element, consisting of: margins, borders, padding, and the actual content." },
  { topic: "History", question: "In what year did World War II end?", answer: "1945." },
];

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>(FLASHCARDS_KEY, []);
  const [progress, setProgress] = useLocalStorage<DailyProgress[]>(PROGRESS_KEY, []);
  const [initialized, setInitialized] = React.useState(false);


  const internalAddFlashcard = useCallback((data: AddFlashcardData, isMock: boolean = false) => {
    const initialSM2 = getInitialSM2Data();
    const newCard: Flashcard = {
      id: crypto.randomUUID(),
      topic: data.topic,
      question: data.question,
      answer: data.answer,
      interval: initialSM2.interval,
      repetition: initialSM2.repetition,
      efactor: initialSM2.efactor,
      // Use provided due date, or initialSM2's due date (today)
      dueDate: data.dueDate ? data.dueDate : initialSM2.dueDate, 
      lastReviewed: initialSM2.lastReviewed,
      createdAt: initialSM2.createdAt,
    };
    setFlashcards(prev => [...prev, newCard]);
    if (!isMock && newCard.repetition === 0 && data.dueDate === initialSM2.dueDate) {
      // If it's a truly new card set to be due today by default, count it in progress.
      // updateProgress(true); // This might be double counting if reviewCard also calls it.
      // Let's let reviewCard handle progress updates for new cards when they are first reviewed.
    }
  }, [setFlashcards]);


  useEffect(() => {
    if (flashcards.length === 0 && !initialized && typeof window !== 'undefined') {
        initialMockFlashcardsData.forEach(cardData => internalAddFlashcard(cardData, true));
        setInitialized(true); 
    } else if (flashcards.length > 0 && !initialized) {
        setInitialized(true); 
    }
  }, [flashcards.length, initialized, internalAddFlashcard]);


  const addFlashcard = useCallback((data: AddFlashcardData) => {
    internalAddFlashcard(data, false);
  }, [internalAddFlashcard]);

  const updateFlashcard = useCallback((id: string, data: Partial<Omit<Flashcard, 'id'>>) => {
    setFlashcards(prev => prev.map(card => card.id === id ? { ...card, ...data } : card));
  }, [setFlashcards]);

  const deleteFlashcard = useCallback((id: string) => {
    setFlashcards(prev => prev.filter(card => card.id !== id));
  }, [setFlashcards]);

  const getCardById = useCallback((id: string) => {
    return flashcards.find(card => card.id === id);
  }, [flashcards]);
  
  const updateProgress = useCallback((isNewLearning: boolean) => {
    const todayStr = format(startOfDay(new Date()), 'yyyy-MM-dd');
    setProgress(prevProgress => {
      const existingEntry = prevProgress.find(p => p.date === todayStr);
      if (existingEntry) {
        return prevProgress.map(p => 
          p.date === todayStr 
            ? { ...p, reviewedCount: p.reviewedCount + 1, newCount: p.newCount + (isNewLearning ? 1 : 0) } 
            : p
        );
      } else {
        return [...prevProgress, { date: todayStr, reviewedCount: 1, newCount: isNewLearning ? 1 : 0 }];
      }
    });
  }, [setProgress]);

  const reviewCard = useCallback((id: string, quality: CardQuality) => {
    const card = flashcards.find(c => c.id === id);
    if (card) {
      const isNewLearning = card.repetition === 0 && quality >=3; // card.repetition is before SM2 update
      const updatedCard = calculateSpacedRepetition(card, quality);
      setFlashcards(prev => prev.map(c => c.id === id ? updatedCard : c));
      updateProgress(isNewLearning);
    }
  }, [flashcards, setFlashcards, updateProgress]);

  const getDueCards = useCallback(() => {
    const today = startOfDay(new Date());
    return flashcards.filter(card => {
      const dueDate = parseISO(card.dueDate);
      return dueDate <= today;
    }).sort((a,b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
  }, [flashcards]);

  const totalCards = useMemo(() => flashcards.length, [flashcards]);
  const cardsDueToday = useMemo(() => getDueCards().length, [getDueCards]);

  const getTopics = useCallback(() => {
    const topics = new Set(flashcards.map(card => card.topic));
    return Array.from(topics).sort();
  }, [flashcards]);

  const getProgressData = useCallback(() => {
    return progress;
  }, [progress]);

  const resetProgress = useCallback(() => {
     setFlashcards([]);
     setProgress([]);
     setInitialized(false); 
  }, [setFlashcards, setProgress]);

  const getOverallMastery = useCallback((): number => {
    if (flashcards.length === 0) return 0;
    const totalMasteryScore = flashcards.reduce((sum, card) => {
      const ef = card.efactor;
      const normalizedEF = Math.max(1.3, ef); 
      let masteryPercentage = ((normalizedEF - 1.3) / (2.5 - 1.3)) * 100;
      masteryPercentage = Math.max(0, Math.min(100, masteryPercentage));
      return sum + masteryPercentage;
    }, 0);
    return Math.round(totalMasteryScore / flashcards.length);
  }, [flashcards]);

  const getCardDistribution = useCallback((): CardDistributionData[] => {
    if (flashcards.length === 0) {
      return [
        { name: 'Difficult (EF < 1.8)', value: 0 },
        { name: 'Learning (EF 1.8-2.49)', value: 0 },
        { name: 'Known Well (EF >= 2.5)', value: 0 },
      ];
    }
    let difficult = 0;
    let learning = 0;
    let knownWell = 0;

    flashcards.forEach(card => {
      if (card.efactor < 1.8) {
        difficult++;
      } else if (card.efactor < 2.5) {
        learning++;
      } else {
        knownWell++;
      }
    });

    return [
      { name: 'Difficult (EF < 1.8)', value: difficult },
      { name: 'Learning (EF 1.8-2.49)', value: learning },
      { name: 'Known Well (EF >= 2.5)', value: knownWell },
    ];
  }, [flashcards]);
  
  const getTopicMastery = useCallback((topicName: string): number => {
    const topicCards = flashcards.filter(card => card.topic === topicName);
    if (topicCards.length === 0) return 0;

    const totalTopicMasteryScore = topicCards.reduce((sum, card) => {
      const ef = card.efactor;
      const normalizedEF = Math.max(1.3, ef);
      let masteryPercentage = ((normalizedEF - 1.3) / (2.5 - 1.3)) * 100;
      masteryPercentage = Math.max(0, Math.min(100, masteryPercentage));
      return sum + masteryPercentage;
    }, 0);
    return Math.round(totalTopicMasteryScore / topicCards.length);
  }, [flashcards]);


  const contextValue = useMemo(() => ({
    flashcards,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getCardById,
    getDueCards,
    reviewCard,
    totalCards,
    cardsDueToday,
    getTopics,
    getProgressData,
    resetProgress,
    getOverallMastery,
    getCardDistribution,
    getTopicMastery,
  }), [flashcards, addFlashcard, updateFlashcard, deleteFlashcard, getCardById, getDueCards, reviewCard, totalCards, cardsDueToday, getTopics, getProgressData, resetProgress, getOverallMastery, getCardDistribution, getTopicMastery]);

  return (
    <FlashcardContext.Provider value={contextValue}>
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = (): FlashcardContextType => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
};
