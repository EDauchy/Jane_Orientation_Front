import type { ReactNode } from "react";

export type CardVariant =
  | "purple"
  | "orange"
  | "pink"
  | "soft"
  | "yellow"
  | "white";
export type CardPadding = "sm" | "md" | "lg";

type Props = {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "button";
  onClick?: () => void;
};

const VARIANT: Record<CardVariant, string> = {
  purple: "bg-purple text-white",
  orange: "bg-orange text-white",
  pink: "bg-pink text-white",
  yellow: "bg-yellow text-ink",
  soft: "bg-purple-lt text-ink",
  white: "bg-white text-ink border border-ink/5 shadow-card",
};

const PADDING: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  variant = "soft",
  padding = "md",
  children,
  className = "",
  as: Tag = "div",
  onClick,
}: Props) {
  return (
    <Tag
      onClick={onClick}
      className={`rounded-3xl ${VARIANT[variant]} ${PADDING[padding]} ${className}`}
    >
      {children}
    </Tag>
  );
}
