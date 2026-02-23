import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  as?: 'div' | 'section' | 'article';
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

const variantMap = {
  default: 'bg-surface border border-border rounded-lg',
  gradient: 'bg-surface border border-primary/30 rounded-lg bg-gradient-to-br from-primary/5 to-accent/5',
  interactive: 'bg-surface border border-border rounded-lg hover:border-primary/50 hover:bg-slate-800/30 transition-all duration-200 cursor-pointer',
} as const;

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag className={`${variantMap[variant]} ${paddingMap[padding]} ${className}`}>
      {children}
    </Tag>
  );
}
