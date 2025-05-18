"use client";

import React, { useState }  from 'react';
import AddEditCardForm from '@/components/flashcards/AddEditCardForm';
import CardListItem from '@/components/flashcards/CardListItem';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, LayoutGrid } from 'lucide-react';

export default function ManageCardsPage() {
  const { flashcards, getTopics } = useFlashcards();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const topics = ['all', ...getTopics()];

  const filteredCards = flashcards
    .filter(card => 
      (selectedTopic === 'all' || card.topic === selectedTopic) &&
      (card.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
       card.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       card.topic.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Your Flashcards</h1>
          <p className="text-muted-foreground">Create, edit, and organize all your learning material.</p>
        </div>
        <AddEditCardForm />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input 
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by topic" />
          </SelectTrigger>
          <SelectContent>
            {topics.map(topic => (
              <SelectItem key={topic} value={topic}>
                {topic === 'all' ? 'All Topics' : topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto hidden sm:block">
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
                <TabsList>
                    <TabsTrigger value="grid" aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></TabsTrigger>
                    <TabsTrigger value="list" aria-label="List view"><List className="h-4 w-4" /></TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </div>

      {filteredCards.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredCards.map(card => (
            <CardListItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No flashcards found.</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new card!</p>
        </div>
      )}
    </div>
  );
}
