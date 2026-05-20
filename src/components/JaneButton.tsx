import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface JaneButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  to?: string;
}

export default function JaneButton({
  children,
  variant = "primary",
  size = "md",
  className,
  to,
  ...props
}: JaneButtonProps) {
  const sizeClasses = {
    xs: "px-4 sm:px-6 py-2.5 text-xs",
    sm: "px-8 py-3 text-sm",
    md: "px-8 py-2.5 text-md",
    lg: "px-8 py-2.5 text-lg",
    xl: "px-8 py-2.5 text-xl",
  };

  const variantClasses = {
    primary:
      "border-2 border-jane-purple bg-white text-jane-purple hover:bg-gray-50",
    secondary: "bg-primary text-white hover:bg-primary-light",
  };

  const combinedClasses = cn(
    "flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-wide transition-colors font-montserrat disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
