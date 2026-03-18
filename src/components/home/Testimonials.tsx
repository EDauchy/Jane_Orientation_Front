"use client";

import React, { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import type { Testimonial } from "../../shard/types";

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Amélie Rousseau",
      role: "Passionnée de cuisine",
      avatar: "AR",
      rating: 5,
      text: "Une expérience unique, j'ai rencontré des gens formidables autour d'un bon repas !",
      title: "Une expérience unique.",
      color: "#31B3A0",
    },
    {
      name: "Maxime R.",
      role: "Etudiant",
      avatar: "MR",
      rating: 4,
      text: "Super expérience, je recommande !",
      title: "Très satisfait du service.",
      color: "#FF6B6B",
    },
    {
      name: "Sophie L.",
      role: "Designer",
      avatar: "SL",
      rating: 5,
      text: "Une expérience incroyable et très intuitive !",
      title: "Interface très intuitive.",
      color: "#31B3A0",
    },
    {
      name: "Thomas D.",
      role: "Architecte",
      avatar: "TD",
      rating: 5,
      text: "J'adore le concept, c'est convivial et très bien pensé.",
      title: "Génial !",
      color: "#FF6B6B",
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