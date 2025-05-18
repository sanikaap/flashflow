import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  footerContent?: React.ReactNode;
  children: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({
  title,
  description,
  footerContent,
  children,
  className,
  titleClassName,
  contentClassName,
  ...props
}) => {
  return (
    <Card
      className={cn(
        'bg-card/70 backdrop-blur-md shadow-xl border-border/50', // Glassmorphism effect
        className
      )}
      {...props}
    >
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className={cn('text-2xl font-semibold', titleClassName)}>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>
        {children}
      </CardContent>
      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
};

export default GlassCard;
