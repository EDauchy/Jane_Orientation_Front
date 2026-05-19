import type { ReactNode } from 'react';
import { Pill } from './Pill';

type Props = {
  num: number;
  title: ReactNode;
  label?: string;
  color?: 'purple' | 'orange' | 'pink' | 'yellow' | 'green';
};

export function ModuleHeader({ num, title, label = 'MODULE', color = 'purple' }: Props) {
  return (
    <header className="flex flex-col gap-3 mb-6">
      <div className="flex items-center gap-2">
        <Pill variant={color} size="sm">
          <span>{label}</span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/30 text-[10px] font-black">
            {num}
          </span>
        </Pill>
      </div>
      <h2 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-tight text-purple-dk">
        {title}
      </h2>
    </header>
  );
}
