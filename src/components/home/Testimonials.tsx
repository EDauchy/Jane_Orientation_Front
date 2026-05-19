"use client";

import React, { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import type { Testimonial } from "../../shard/types";

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Camille Moreau",
      role: "Étudiante en BTS",
      avatar: "https://i.pravatar.cc/85?img=47",
      rating: 5,
      text: "Le formulaire d'orientation m'a aidée à clarifier mon projet pro en moins de 10 minutes. Les résultats étaient vraiment précis !",
      title: "Enfin une orientation qui me ressemble.",
      color: "#681BEF",
      date: "03/01/2026",
    },
    {
      name: "Yanis Bencheikh",
      role: "Lycéen en Terminale",
      avatar: "https://i.pravatar.cc/85?img=11",
      rating: 5,
      text: "Je ne savais pas du tout quoi faire après le bac. Jane m'a proposé 3 pistes concrètes qui collent vraiment à ma personnalité.",
      title: "Ça change tout d'avoir un vrai repère.",
      color: "#681BEF",
      date: "17/01/2026",
    },
    {
      name: "Inès Lefebvre",
      role: "En reconversion pro",
      avatar: "https://i.pravatar.cc/85?img=32",
      rating: 5,
      text: "Après 8 ans dans la comptabilité, je cherchais une nouvelle voie. Le test m'a orientée vers le design UX — et c'était exactement ça.",
      title: "Un tournant dans ma carrière.",
      color: "#681BEF",
      date: "28/01/2026",
    },
    {
      name: "Lucas Fontaine",
      role: "Étudiant en Licence",
      avatar: "https://i.pravatar.cc/85?img=15",
      rating: 4,
      text: "Les recommandations ROME sont super utiles pour voir concrètement quels métiers correspondent à mon profil. Très bien fait.",
      title: "Des résultats concrets et actionnables.",
      color: "#681BEF",
      date: "05/02/2026",
    },
    {
      name: "Sara Amrani",
      role: "Conseillère Pôle Emploi",
      avatar: "https://i.pravatar.cc/85?img=44",
      rating: 5,
      text: "Je recommande Jane à mes bénéficiaires. L'analyse est sérieuse, les pistes proposées sont réalistes et bien adaptées au marché.",
      title: "Un outil que je prescris à mes clients.",
      color: "#681BEF",
      date: "19/02/2026",
    },
    {
      name: "Antoine Dupuis",
      role: "Apprenti en alternance",
      avatar: "https://i.pravatar.cc/85?img=8",
      rating: 5,
      text: "Simple, rapide et efficace. En 15 min j'ai eu une analyse complète de mon profil et des métiers qui m'auraient jamais traversé l'esprit.",
      title: "Bluffant de précision.",
      color: "#681BEF",
      date: "11/03/2026",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsToShow, setItemsToShow] = useState<number>(3);

  useEffect(() => {
    const updateLayout = (): void => {
      if (window.innerWidth < 700) {
        setItemsToShow(1);
      } else if (window.innerWidth < 1150) {
        setItemsToShow(2);
      } else {
        setItemsToShow(3);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsToShow);

  const prevSlide = (): void => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const nextSlide = (): void => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="py-10 relative group">
      <div className="overflow-hidden py-10 sm:p-8">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="px-[9px] box-border"
              style={{ minWidth: `${100 / itemsToShow}%` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Précédent */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-10 -translate-y-1/2 bg-white/40 backdrop-blur-xs hover:bg-white text-gray-800 p-1 rounded-full shadow-xl z-10 -ml-4 transition-all"
        aria-label="Précédent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 -rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#681bff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
        </svg>
      </button>

      {/* Bouton Suivant */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-10 -translate-y-1/2 bg-white/40 backdrop-blur-xs hover:bg-white text-gray-800 p-1 rounded-full shadow-lg z-10 -mr-4 transition-all"
        aria-label="Suivant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#681bff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
        </svg>
      </button>
    </div>
  );
};

export default Testimonials;
