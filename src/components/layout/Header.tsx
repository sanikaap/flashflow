"use client";

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import Link from 'next/link';
import { Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" /> {/* Hidden on md and up as sidebar becomes persistent */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Zap className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold">Flashflow</span>
        </Link>
      </div>
      {/* Future elements like User Profile Dropdown can go here */}
    </header>
  );
};

export default Header;
