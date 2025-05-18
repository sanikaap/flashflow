"use client";

import React from 'react';
import type { Flashcard } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import AddEditCardForm from './AddEditCardForm';
import { useFlashcards } from '@/contexts/FlashcardContext';
import GlassCard from '@/components/shared/GlassCard';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface CardListItemProps {
  card: Flashcard;
}

const CardListItem: React.FC<CardListItemProps> = ({ card }) => {
  const { deleteFlashcard } = useFlashcards();

  return (
    <GlassCard className="p-0">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg break-all">{card.question.length > 100 ? `${card.question.substring(0, 97)}...` : card.question}</h3>
            <Badge variant="secondary" className="whitespace-nowrap ml-2">{card.topic}</Badge>
        </div>
        <p className="text-sm text-muted-foreground break-all">{card.answer.length > 150 ? `${card.answer.substring(0, 147)}...` : card.answer}</p>
        <div className="text-xs text-muted-foreground">
          <span>Due: {format(parseISO(card.dueDate), 'MMM d, yyyy')}</span> | 
          <span> E-Factor: {card.efactor.toFixed(2)}</span> |
          <span> Interval: {card.interval}d</span> |
          <span> Reps: {card.repetition}</span>
        </div>
      </div>
      <div className="p-4 border-t bg-muted/30 flex justify-end space-x-2">
        <AddEditCardForm card={card} />
        <Button variant="destructive" size="icon" onClick={() => deleteFlashcard(card.id)} title="Delete Card">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );
};

export default CardListItem;
