
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import FlashcardView from '@/components/flashcards/FlashcardView';
import { useFlashcards } from '@/contexts/FlashcardContext';
import type { Flashcard, CardQuality } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, CheckCheck, Hourglass } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';

export default function ReviewPage() {
  const { getDueCards, reviewCard, cardsDueToday } = useFlashcards();
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [initialDueCount, setInitialDueCount] = useState(0);

  const loadDueCards = useCallback(() => {
    const cards = getDueCards();
    setDueCards(cards);
    setInitialDueCount(cards.length);
    setCurrentCardIndex(0);
    setSessionComplete(cards.length === 0);
  }, [getDueCards]);

  useEffect(() => {
    loadDueCards();
  }, [loadDueCards]);
  
  const handleReviewed = (quality: CardQuality) => {
    if (currentCardIndex < dueCards.length) {
      const cardId = dueCards[currentCardIndex].id;
      reviewCard(cardId, quality);
      
      // Move to the next card or end session
      if (currentCardIndex + 1 < dueCards.length) {
        setCurrentCardIndex(prevIndex => prevIndex + 1);
      } else {
        setSessionComplete(true);
      }
    }
  };

  const currentCard = dueCards[currentCardIndex];
  const progressPercentage = initialDueCount > 0 ? ((currentCardIndex) / initialDueCount) * 100 : 0;

  if (sessionComplete && initialDueCount === 0 && cardsDueToday === 0) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <GlassCard className="max-w-md p-8">
            <CheckCheck className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">All Caught Up!</h1>
            <p className="text-muted-foreground mb-6">
                You have no cards due for review right now. Great job!
            </p>
            <div className="space-y-3">
                <Link href="/manage" passHref>
                    <Button className="w-full">Add More Cards</Button>
                </Link>
                <Link href="/" passHref>
                    <Button variant="outline" className="w-full">Back to Dashboard</Button>
                </Link>
            </div>
        </GlassCard>
      </div>
    );
  }
  
  if (sessionComplete && initialDueCount > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
         <GlassCard className="max-w-md p-8">
            <CheckCheck className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Session Complete!</h1>
            <p className="text-muted-foreground mb-6">
              You've reviewed all due cards for this session. Keep up the great work!
            </p>
            <div className="space-y-3">
                <Button onClick={loadDueCards} className="w-full">Review More (if any new cards are due)</Button>
                <Link href="/" passHref>
                    <Button variant="outline" className="w-full">Back to Dashboard</Button>
                </Link>
            </div>
        </GlassCard>
      </div>
    );
  }


  if (!currentCard && !sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <GlassCard className="max-w-md p-8">
            <Hourglass className="h-16 w-16 text-primary mx-auto mb-6 animate-spin-slow" />
            <h1 className="text-3xl font-bold mb-4">Loading Review Session...</h1>
            <p className="text-muted-foreground mb-6">
                Getting your cards ready. If this takes a while, you might not have any cards due.
            </p>
             <Link href="/" passHref>
                <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back to Dashboard
                </Button>
            </Link>
        </GlassCard>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Session</h1>
          <p className="text-muted-foreground">
            {initialDueCount > 0 ? `Card ${currentCardIndex + 1} of ${initialDueCount}` : 'No cards due for review.'}
          </p>
        </div>
        <Link href="/" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> End Session
          </Button>
        </Link>
      </div>

      {initialDueCount > 0 && (
        <div className="w-full bg-muted rounded-full h-2.5 mb-4">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
      
      {currentCard && <FlashcardView key={currentCard.id} card={currentCard} onReviewed={handleReviewed} />}

    </div>
  );
}
