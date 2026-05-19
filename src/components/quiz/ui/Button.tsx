import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'lg';

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'children'
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onAnimationStart'
  | 'onAnimationEnd'
  | 'onAnimationIteration'
>;

type Props = NativeButtonProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
};

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-purple text-white hover:bg-purple-dk disabled:bg-purple/40',
  secondary: 'bg-ink text-white hover:bg-ink/90 disabled:bg-ink/30',
  ghost: 'bg-transparent text-ink hover:bg-ink/5 disabled:text-ink/30',
  danger: 'bg-red text-white hover:bg-red/90 disabled:bg-red/40',
};

const SIZE: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-14 px-7 text-[16px]',
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    variant = 'primary',
    size = 'lg',
    children,
    leadingIcon,
    trailingIcon,
    fullWidth,
    className = '',
    disabled,
    ...rest
  },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-colors ${VARIANT[variant]} ${SIZE[size]} ${fullWidth ? 'w-full' : ''} disabled:cursor-not-allowed ${className}`}
      {...rest}
    >
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="shrink-0">{trailingIcon}</span> : null}
    </motion.button>
  );
});
