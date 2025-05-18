"use client";

import React from 'react';
import { useFlashcards } from '@/contexts/FlashcardContext';
import GlassCard from '@/components/shared/GlassCard';
import { BarChart, Zap, Clock } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

const ProgressSummary: React.FC = () => {
  const { flashcards, getProgressData } = useFlashcards();

  const progressData = getProgressData();
  const totalReviewedAllTime = progressData.reduce((sum, day) => sum + day.reviewedCount, 0);
  
  let longestStreak = 0;
  let currentStreak = 0;
  if (progressData.length > 0) {
    const sortedDates = progressData.map(p => parseISO(p.date)).sort((a, b) => a.getTime() - b.getTime());
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0 || differenceInDays(sortedDates[i], sortedDates[i-1]) === 1) {
        currentStreak++;
      } else if (differenceInDays(sortedDates[i], sortedDates[i-1]) > 1) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1; // Reset for the new day
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }
  // Check if today is part of the streak
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayProgress = progressData.find(p => p.date === todayStr);
  if (!todayProgress && currentStreak > 0 && sortedDates.length > 0) {
     // if last review day was yesterday, currentStreak is valid, otherwise it's broken
     if (differenceInDays(new Date(), sortedDates[sortedDates.length-1]) > 1) {
        currentStreak = 0;
     }
  } else if (!todayProgress && currentStreak === 0) {
    currentStreak = 0;
  }


  const averageCardsPerDay = progressData.length > 0 
    ? (totalReviewedAllTime / progressData.length).toFixed(1) 
    : 0;

  return (
    <GlassCard title="Learning Summary" titleClassName="text-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <BarChart className="h-8 w-8 text-primary mb-2" />
          <p className="text-2xl font-bold">{totalReviewedAllTime}</p>
          <p className="text-sm text-muted-foreground">Total Reviews</p>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Zap className="h-8 w-8 text-primary mb-2" />
          <p className="text-2xl font-bold">{currentStreak} Day{currentStreak === 1 ? '' : 's'}</p>
          <p className="text-sm text-muted-foreground">Current Streak</p>
        </div>
        <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
          <Clock className="h-8 w-8 text-primary mb-2" />
          <p className="text-2xl font-bold">{averageCardsPerDay}</p>
          <p className="text-sm text-muted-foreground">Avg. Reviews/Day</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProgressSummary;
