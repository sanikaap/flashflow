
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Flashcard as FlashcardType, CardQuality } from '@/lib/types';

interface FlashcardProps {
  card: FlashcardType;
  onReviewed: (quality: CardQuality) => void;
}

const FlashcardView: React.FC<FlashcardProps> = ({ card, onReviewed }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  useEffect(() => {
    setIsFlipped(false);
  }, [card]);

  const handleReview = (quality: CardQuality) => {
    onReviewed(quality);
  };

  const cardVariants = {
    front: { rotateY: 0 },
    back: { rotateY: 180 },
  };

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.15 } }, // Adjusted delay for smoother appearance after flip
  };

  return (
    <div className="w-full max-w-xl mx-auto perspective">
      <motion.div
        className={cn(
          "relative w-full h-[300px] sm:h-[350px] md:h-[400px] cursor-pointer transform-style-preserve-3d",
          "p-1 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--accent))] rounded-xl shadow-2xl" // Gradient border and shadow on outer container
        )}
        variants={cardVariants}
        animate={isFlipped ? 'back' : 'front'}
        transition={{ duration: 0.6 }}
        onClick={handleFlip}
      >
        {/* Front of the card */}
        <motion.div
          className={cn(
            'absolute inset-0 w-full h-full rounded-lg p-6 flex flex-col items-center justify-center text-center backface-hidden',
            'bg-card/80 backdrop-blur-lg' // Inner face style
          )}
          style={{ transform: 'rotateY(0deg)' }} // Ensures this face is visible when not flipped
        >
          <AnimatePresence>
            {!isFlipped && (
              <motion.div
                className="w-full h-full flex flex-col items-center justify-center"
                key="question"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{card.topic}</p>
                <h2 className="text-2xl sm:text-3xl font-semibold">{card.question}</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back of the card */}
        <motion.div
          className={cn(
            'absolute inset-0 w-full h-full rounded-lg p-6 flex flex-col items-center justify-center text-center backface-hidden',
            'bg-card/80 backdrop-blur-lg' // Inner face style
          )}
          style={{ transform: 'rotateY(180deg)' }} // Ensures this face is visible when flipped
        >
          <AnimatePresence>
            {isFlipped && (
              <motion.div
                className="w-full h-full flex flex-col items-center justify-center"
                key="answer"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Answer</p>
                <h2 className="text-xl sm:text-2xl font-medium">{card.answer}</h2>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {isFlipped && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center space-x-4"
        >
          <Button
            variant="destructive"
            size="lg"
            className="w-1/2 sm:w-auto"
            onClick={(e) => { e.stopPropagation(); handleReview(1);}}
          >
            <XCircle className="mr-2 h-5 w-5" /> Don't Know
          </Button>
          <Button
            variant="default" 
            size="lg"
            className="w-1/2 sm:w-auto"
            onClick={(e) => { e.stopPropagation(); handleReview(4);}}
          >
            <CheckCircle className="mr-2 h-5 w-5" /> Know
          </Button>
        </motion.div>
      )}
      <style jsx global>{`
        .perspective {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default FlashcardView;
