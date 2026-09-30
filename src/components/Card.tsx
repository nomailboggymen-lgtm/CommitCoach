import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-neutral-200 bg-white p-5 ${onClick ? 'cursor-pointer hover:border-neutral-300 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
