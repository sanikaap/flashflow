import React from 'react';
import GlassCard from '@/components/shared/GlassCard';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  iconColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, className, iconColor = "text-primary" }) => {
  return (
    <GlassCard className={cn("p-0", className)}>
      <div className="p-6 flex flex-row items-center justify-between space-y-0">
        <div className="flex flex-col space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-3xl font-bold">{value}</div>
        </div>
        <div className={cn('p-3 rounded-full bg-primary/10', iconColor)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </GlassCard>
  );
};

export default StatsCard;
