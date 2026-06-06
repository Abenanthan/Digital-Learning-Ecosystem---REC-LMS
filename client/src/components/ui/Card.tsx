import React from 'react';
import { cn } from '@/lib/utils';

// ─── Card ───────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── CardHeader ─────────────────────────────────────────────────────────────────

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('px-6 py-4 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── CardContent ────────────────────────────────────────────────────────────────

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
}

// ─── CardFooter ─────────────────────────────────────────────────────────────────

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-100 flex items-center',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
