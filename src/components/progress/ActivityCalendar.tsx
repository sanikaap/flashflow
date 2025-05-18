"use client";

import React from 'react';
import { useFlashcards } from '@/contexts/FlashcardContext';
import GlassCard from '@/components/shared/GlassCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { format, parseISO, subMonths, eachWeekOfInterval, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns';

interface CalendarDay {
  date: string; // YYYY-MM-DD
  count: number;
}

const ActivityCalendar: React.FC = () => {
  const { getProgressData } = useFlashcards();
  const rawProgress = getProgressData();

  // Get data for the last 3 months for better visualization
  const endDate = new Date();
  const startDate = subMonths(endDate, 2); // Last 3 months including current

  const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

  const calendarData: CalendarDay[] = daysInRange.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const progressEntry = rawProgress.find(p => p.date === dateStr);
    return {
      date: dateStr,
      count: progressEntry ? progressEntry.reviewedCount : 0,
    };
  });
  
  // For bar chart, group by month
  const monthlyData = calendarData.reduce((acc, day) => {
    const month = format(parseISO(day.date), 'MMM yyyy');
    const existingMonth = acc.find(m => m.name === month);
    if (existingMonth) {
      existingMonth.reviews += day.count;
    } else {
      acc.push({ name: month, reviews: day.count });
    }
    return acc;
  }, [] as {name: string, reviews: number}[]).slice(-3); // take last 3 months

  return (
    <GlassCard title="Monthly Review Activity" titleClassName="text-xl">
      <div className="h-[300px] w-full">
        {monthlyData.some(d => d.reviews > 0) ? (
           <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false}/>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="reviews" fill="hsl(var(--chart-1))" name="Total Reviews" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No review activity in the last 3 months.
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        This is a simplified monthly view. A full heatmap can be complex.
      </p>
    </GlassCard>
  );
};

export default ActivityCalendar;
