
"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import GlassCard from '@/components/shared/GlassCard';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { format, parseISO, subDays, eachDayOfInterval } from 'date-fns';

const COLORS = ['hsl(var(--chart-3))', 'hsl(var(--chart-2))', 'hsl(var(--chart-1))']; // Adjusted for Difficult, Learning, Known Well

const ProgressChart: React.FC = () => {
  const { getProgressData, getCardDistribution, totalCards } = useFlashcards();
  const rawProgress = getProgressData();

  // Process data for the last 7 days for Bar Chart
  const endDate = new Date();
  const startDate = subDays(endDate, 6);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const barChartData = dateRange.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const progressEntry = rawProgress.find(p => p.date === dateStr);
    return {
      name: format(date, 'MMM d'), 
      reviewed: progressEntry ? progressEntry.reviewedCount : 0,
      new: progressEntry ? progressEntry.newCount : 0,
    };
  });

  const pieData = getCardDistribution();
  const noPieData = totalCards === 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <GlassCard title="Weekly Review Activity" titleClassName="text-xl">
        <div className="h-[300px] w-full">
          {barChartData.some(d => d.reviewed > 0 || d.new > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
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
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="reviewed" fill="hsl(var(--chart-1))" name="Reviewed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="new" fill="hsl(var(--chart-2))" name="New Learned" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No review activity in the last 7 days.
            </div>
          )}
        </div>
      </GlassCard>
      <GlassCard title="Card Knowledge Distribution" titleClassName="text-xl">
         <div className="h-[300px] w-full">
            {noPieData ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Add some cards to see your knowledge distribution.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent, value }) => value > 0 ? `${name.split('(')[0].trim()} ${(percent * 100).toFixed(0)}%` : null}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => value.split('(')[0].trim()} />
                </PieChart>
              </ResponsiveContainer>
            )}
        </div>
      </GlassCard>
    </div>
  );
};

export default ProgressChart;
