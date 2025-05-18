"use client";

import React, { useState, useEffect } from 'react';
import { FlashcardProvider } from '@/contexts/FlashcardContext';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/AppSidebar';
import Header from '@/components/layout/Header';

const ONBOARDING_COMPLETED_KEY = 'flashflow_onboarding_completed';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useLocalStorage(ONBOARDING_COMPLETED_KEY, false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Only show onboarding if it hasn't been completed.
    // Delay slightly to ensure localStorage has loaded.
    const timer = setTimeout(() => {
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [onboardingCompleted]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };

  return (
    <FlashcardProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col">
          <div className="flex flex-1">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <Header />
              <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">
                {children}
              </main>
            </div>
          </div>
        </div>
        <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
        <Toaster />
      </SidebarProvider>
    </FlashcardProvider>
  );
}
