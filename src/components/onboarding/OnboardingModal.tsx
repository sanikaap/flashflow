"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Zap, BookOpen, BarChart3, Settings } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-card/90 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">Welcome to Flashflow!</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            Master anything with smart flashcards. Here's a quick guide to get you started.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-primary/20 text-primary">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Dashboard Overview</h3>
              <p className="text-sm text-muted-foreground">
                Get a quick glance at your total cards, review stats, and learning progress.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-primary/20 text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Review Sessions</h3>
              <p className="text-sm text-muted-foreground">
                Engage in review sessions. Cards you know well appear less often, cards you struggle with appear more.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-primary/20 text-primary">
              <Settings size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Manage Your Cards</h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, and organize your flashcards by topic in the 'Manage Cards' section.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-full bg-primary/20 text-primary">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Track Your Progress</h3>
              <p className="text-sm text-muted-foreground">
                Visualize your study habits and improvements over time in the 'Progress' section.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Let's Get Started!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
