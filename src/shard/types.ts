import type { IconType } from "react-icons";

export interface ArticleProps {
  imageUrl: string;
  title: string;
  date: string;
  tags?: string[]; 
  gradientColorClass?: string;
}


export interface TimeLeft {
  j?: number;
  h?: number;
  m?: number;
  s?: number;
}

export interface CountdownGuardProps {
  targetDate: string;
  children: React.ReactNode;
  containerClass?: string;
  color?: string; 
}



export interface CountdownSimpleProps {
  targetDate: string;
  color?: string;          // ex: "white", "amber-500"
  fontSize?: string;       // ex: "text-4xl", "text-lg"
  containerClass?: string; // ex: "bg-black p-4 rounded-xl"
}

export interface CustomSectionProps {
  title: string;
  children: React.ReactNode;
}


export interface SocialIcon {
  key: string;
  url: string;
  Icon: IconType;
}


export interface SocialLinksProps {
  color?: string;
}


export interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  title: string;
  color: string;
  date: string;
}

export interface TestimonialCardProps {
  testimonial: Testimonial;
}


export interface UserDropdownProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

export interface Formation {
  rnd: string;
  etab_nom: string;
  etab_gps: { lat: number; lon: number } | null;
  nm: string[];
  fiche: string;
}

export interface MapLogicProps {
  city?: string;
  suggestedJobs?: string[];
}