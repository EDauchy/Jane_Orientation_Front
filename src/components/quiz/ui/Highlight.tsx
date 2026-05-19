import type { ReactNode } from 'react';

export type HighlightColor = 'yellow' | 'orange' | 'pink';

type Props = {
  color?: HighlightColor;
  children: ReactNode;
  className?: string;
};

const MAP: Record<HighlightColor, string> = {
  yellow: 'bg-yellow text-ink',
  orange: 'bg-orange text-white',
  pink: 'bg-pink text-white',
};

export function Highlight({ color = 'yellow', children, className = '' }: Props) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-md leading-[1.05] ${MAP[color]} ${className}`}
    >
      {children}
    </span>
  );
}
