"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import type { Flashcard } from '@/lib/types';
import { useFlashcards } from '@/contexts/FlashcardContext';
import { PlusCircle, Edit3, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, startOfDay, formatISO } from 'date-fns';
import { cn } from "@/lib/utils";

const cardSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(50, 'Topic too long'),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  dueDate: z.date().optional(),
});

type CardFormData = z.infer<typeof cardSchema>;

interface AddEditCardFormProps {
  card?: Flashcard; // For editing
  triggerButton?: React.ReactNode; // Custom trigger
  onFormSubmit?: () => void; // Callback after submission
}

const AddEditCardForm: React.FC<AddEditCardFormProps> = ({ card, triggerButton, onFormSubmit }) => {
  const { addFlashcard, updateFlashcard } = useFlashcards();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: card ? {
      topic: card.topic,
      question: card.question,
      answer: card.answer,
      dueDate: card.dueDate ? parseISO(card.dueDate) : undefined,
    } : {
      topic: '',
      question: '',
      answer: '',
      dueDate: new Date(), // Default to today for new cards
    },
  });
  
  React.useEffect(() => {
    if (isOpen) {
      if (card) {
        form.reset({
            topic: card.topic,
            question: card.question,
            answer: card.answer,
            dueDate: card.dueDate ? parseISO(card.dueDate) : undefined,
        });
      } else {
        form.reset({
            topic: '',
            question: '',
            answer: '',
            dueDate: new Date(), // Default to today for new cards
        });
      }
    }
  }, [card, form, isOpen]);


  const onSubmit: SubmitHandler<CardFormData> = (formData) => {
    const commonData = {
      topic: formData.topic,
      question: formData.question,
      answer: formData.answer,
    };

    if (card) { // Editing
      const updatePayload: Partial<Omit<Flashcard, 'id'>> = { ...commonData };
      if (formData.dueDate) {
        updatePayload.dueDate = formatISO(startOfDay(formData.dueDate));
      }
      // If formData.dueDate is undefined (cleared), it won't be sent, preserving existing dueDate.
      // To explicitly clear or reset dueDate on edit, specific logic would be needed here.
      // For now, clearing the field means the due date is not part of the update payload.
      updateFlashcard(card.id, updatePayload);
    } else { // Adding
      const addPayload: Parameters<typeof addFlashcard>[0] = { ...commonData };
      if (formData.dueDate) {
        addPayload.dueDate = formatISO(startOfDay(formData.dueDate));
      }
      // If formData.dueDate is undefined, context's addFlashcard will use initialSM2.dueDate (today)
      addFlashcard(addPayload);
    }
    form.reset({ topic: '', question: '', answer: '', dueDate: new Date() });
    setIsOpen(false);
    if (onFormSubmit) onFormSubmit();
  };

  const defaultTrigger = card ? (
    <Button variant="ghost" size="icon" title="Edit Card">
      <Edit3 className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <PlusCircle className="mr-2 h-4 w-4" /> Add New Card
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card/90 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>{card ? 'Edit Flashcard' : 'Create New Flashcard'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic / Deck</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., JavaScript Basics, History Dates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question (Front)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What is the capital of France?" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer (Back)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paris" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < startOfDay(new Date()) && !card // Allow past dates for editing, but not for new cards if desired
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    If not set for a new card, it defaults to today.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">{card ? 'Save Changes' : 'Create Card'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCardForm;
