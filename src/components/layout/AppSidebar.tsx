"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Home, Layers, BookOpenText, BarChart3, LogOut, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useFlashcards } from '@/contexts/FlashcardContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/review', label: 'Review', icon: BookOpenText },
  { href: '/manage', label: 'Manage Cards', icon: Layers },
  { href: '/progress', label: 'Progress', icon: BarChart3 },
];

const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { resetProgress } = useFlashcards();


  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
         <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <Zap className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">Flashflow</span>
        </Link>
      </SidebarHeader>
      <Separator className="mb-2" />
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "ml-2" }}
                  className="justify-start"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
         <Separator className="my-2" />
         <Button 
            variant="outline" 
            className="w-full justify-start group-data-[collapsible=icon]:justify-center"
            onClick={resetProgress}
            title="Reset Data (Dev)"
          >
          <LogOut className="h-5 w-5"/>
          <span className="group-data-[collapsible=icon]:hidden ml-2">Reset Data</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
