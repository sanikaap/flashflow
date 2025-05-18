
"use client";

import React from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressChart from '@/components/dashboard/ProgressChart';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Layers, BookOpenText, PlusCircle, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/shared/GlassCard';

export default function DashboardPage() {
  const { totalCards, cardsDueToday, getOverallMastery } = useFlashcards();
  const overallMastery = getOverallMastery();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your learning snapshot.</p>
        </div>
        <Link href="/manage" passHref>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Card
            </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard title="Total Cards" value={totalCards} icon={Layers} />
        <StatsCard title="Due Today" value={cardsDueToday} icon={BookOpenText} />
        <StatsCard title="Mastery (Est.)" value={`${overallMastery}%`} icon={TrendingUp} iconColor="text-accent"/>
      </div>

      <ProgressChart />

      <GlassCard title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/review" passHref>
                <Button variant="outline" className="w-full justify-start text-base py-6">
                    <BookOpenText className="mr-3 h-5 w-5 text-primary" /> Start Review Session
                </Button>
            </Link>
            <Link href="/manage" passHref>
                 <Button variant="outline" className="w-full justify-start text-base py-6">
                    <Layers className="mr-3 h-5 w-5 text-primary" /> Manage Your Cards
                </Button>
            </Link>
             <Link href="/progress" passHref>
                 <Button variant="outline" className="w-full justify-start text-base py-6">
                    <TrendingUp className="mr-3 h-5 w-5 text-primary" /> View Full Progress
                </Button>
            </Link>
        </div>
      </GlassCard>
    </div>
  );
}
