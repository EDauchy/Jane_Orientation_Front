import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = {
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function StepShell({ children, footer, className = '' }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        className={`flex-1 w-full max-w-[680px] mx-auto px-6 pt-6 pb-40 ${className}`}
      >
        {children}
      </motion.main>
      {footer ? (
        <footer className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/95 to-white/0 pt-6 pb-6">
          <div className="w-full max-w-[680px] mx-auto px-6">{footer}</div>
        </footer>
      ) : null}
    </div>
  );
}
