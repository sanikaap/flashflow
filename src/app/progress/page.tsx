
"use client";

import React from 'react';
import ProgressSummary from '@/components/progress/ProgressSummary';
import ActivityCalendar from '@/components/progress/ActivityCalendar'; // Simplified bar chart
import GlassCard from '@/components/shared/GlassCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Award, BookHeart, CalendarDays } from 'lucide-react';
import { useFlashcards } from '@/contexts/FlashcardContext';

export default function ProgressPage() {
  const { getTopics, getTopicMastery, flashcards } = useFlashcards();
  const topics = getTopics();

  const topicProgress = topics.map(topicName => ({
    name: topicName,
    mastery: getTopicMastery(topicName),
    cards: flashcards.filter(card => card.topic === topicName).length,
  })).sort((a,b) => b.mastery - a.mastery || b.cards - a.cards); // Sort by mastery, then by card count

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Learning Progress</h1>
        <p className="text-muted-foreground">Track your journey and see how far you've come.</p>
      </div>

      <ProgressSummary />
      
      <ActivityCalendar />

      <GlassCard title="Topic Mastery" titleClassName="text-xl">
        {topicProgress.length > 0 ? (
          <div className="space-y-4">
            {topicProgress.map(topic => (
              <div key={topic.name} className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{topic.name}</span>
                  <span className="text-sm text-primary font-semibold">{topic.mastery}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${topic.mastery}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{topic.cards} card{topic.cards === 1 ? '' : 's'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No topics found.</p>
            <p className="text-xs text-muted-foreground">Add some flashcards to see your topic mastery.</p>
          </div>
        )}
      </GlassCard>

       <GlassCard title="Next Steps">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/review" passHref>
                <Button variant="default" className="w-full justify-start text-base py-6">
                    <BookHeart className="mr-3 h-5 w-5"/> Continue Reviewing
                </Button>
            </Link>
            <Link href="/manage" passHref>
                 <Button variant="outline" className="w-full justify-start text-base py-6">
                    <CalendarDays className="mr-3 h-5 w-5"/> Manage & Add Cards
                </Button>
            </Link>
        </div>
      </GlassCard>

    </div>
  );
}

