import type { ReactNode } from "react";

export type PillVariant =
  | "purple"
  | "yellow"
  | "orange"
  | "pink"
  | "green"
  | "red"
  | "ghost";

export type PillSize = "sm" | "md";

type Props = {
  variant?: PillVariant;
  size?: PillSize;
  children: ReactNode;
  className?: string;
};

const VARIANT: Record<PillVariant, string> = {
  purple: "bg-purple text-white",
  yellow: "bg-yellow text-ink",
  orange: "bg-orange text-white",
  pink: "bg-pink text-white",
  green: "bg-green text-ink",
  red: "bg-red text-white",
  ghost: "bg-purple-lt text-purple-dk",
};

const SIZE: Record<PillSize, string> = {
  sm: "text-[10px] px-2.5 py-1",
  md: "text-[12px] px-3 py-1.5",
};

export function Pill({
  variant = "purple",
  size = "md",
  children,
  className = "",
}: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-label ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {children}
    </span>
  );
}
