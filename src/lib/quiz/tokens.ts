export const colors = {
  bg: "#FFFFFF",
  ink: "#1A1A2E",
  muted: "#6B6B85",

  purple: "#6B3FE4",
  purpleDk: "#3D1FA8",
  purpleLt: "#F3EEFF",

  orange: "#FF7A3D",
  orangeLt: "#FFE8DC",

  pink: "#FF6BAE",
  pinkLt: "#FFE0ED",

  yellow: "#FFE34A",
  yellowDk: "#F5C518",

  green: "#34D399",
  greenLt: "#D4F7E7",

  red: "#FF5D6C",
  redLt: "#FFD9DD",
} as const;

export type ColorKey = keyof typeof colors;

export const radii = {
  card: "1.5rem",
  cardLg: "2rem",
  pill: "9999px",
} as const;

export const timings = {
  pagePopMs: 320,
  tapScale: 0.97,
} as const;
