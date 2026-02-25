"use client";

import React, { useState, useEffect, useCallback } from "react";
import LearnMoreButton from "./LearnMoreButton";

// Définition du type pour une diapositive
interface Slide {
  id: number;
  url: string;
  alt: string;
}

// Données pour le carrousel
const slides: Slide[] = [
  {
    id: 1,
    url: "./hero-image.jpg",
    alt: "Image pour Explorer les Possibilités",
  },
  {
    id: 2,
    url: "./hero-image2.jpg",
    alt: "Image pour Construire Votre Chemin",
  },
  {
    id: 3,
    url: "./hero-image3.jpg",
    alt: "Image pour Atteindre Vos Objectifs",
  },
];

const ImageSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  const goToNext = useCallback((): void => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex]);

  // Défilement automatique
  useEffect(() => {
    const slideInterval = setInterval(goToNext, 5000);
    return () => clearInterval(slideInterval);
  }, [goToNext]);

  // Typage du gestionnaire d'erreur d'image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.currentTarget;
    target.onerror = null; // Empêche une boucle infinie si le placeholder échoue aussi
    target.src = "https://placehold.co/800x600/7c3aed/ffffff?text=Erreur+Image";
  };

  return (
    <div className="flex-1 relative overflow-hidden rounded-[30px] mt-20 lg:mt-0">
      <div className="absolute top-0 left-0 z-10 w-[120px] h-[120px] bg-white rounded-br-[30px] hidden lg:block"></div>
      <div className="absolute bottom-0 left-0 z-10 w-[135px] h-[135px] bg-white rounded-tr-[80px] hidden lg:block"></div>

      <div className="absolute left-0 top-0 w-[30px] h-[150px] bg-[radial-gradient(circle_at_bottom_right,transparent_30px,#ffffff_30.5px)] hidden lg:block"></div>
      <div className="absolute left-0 top-0 w-[150px] h-[30px] bg-[radial-gradient(circle_at_bottom_right,transparent_30px,#ffffff_30.5px)] hidden lg:block"></div>

      <div className="absolute left-0 bottom-0 w-[165px] h-[30px] bg-[radial-gradient(circle_at_top_right,transparent_30px,#ffffff_30.5px)] hidden lg:block"></div>
      <div className="absolute left-0 bottom-0 w-[30px] h-[165px] bg-[radial-gradient(circle_at_top_right,transparent_30px,#ffffff_30.5px)] hidden lg:block"></div>

      <div className="absolute left-0 bottom-0 z-10 hidden lg:block">
        <LearnMoreButton />
      </div>

      <div className="absolute flex flex-col items-center px-5 py-2 rounded-2xl right-5 top-5 bg-white/20 backdrop-blur-md shadow-xl">
        <span className="font-semibold text-primary text-3xl">200+</span>
        <span className="text-lg text-primary">Utilisateurs actifs</span>

        <div className="mt-2 flex items-center">
          <img
            src="https://i.pravatar.cc/40?img=1"
            className="w-8 h-8 rounded-full object-cover z-10 border-2 border-white"
            alt="user 1"
          />
          <img
            src="https://i.pravatar.cc/40?img=2"
            className="w-8 h-8 rounded-full object-cover -ml-3 z-20 border-2 border-white"
            alt="user 2"
          />
          <img
            src="https://i.pravatar.cc/40?img=3"
            className="w-8 h-8 rounded-full object-cover -ml-3 z-30 border-2 border-white"
            alt="user 3"
          />
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold -ml-3 z-40 border-2 border-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
        </div>
      </div>

      {/* Badge Note */}
      <div className="absolute bottom-[155px] left-5 rounded-2xl flex items-center gap-3 text-white bg-white/20 px-5 py-3 backdrop-blur-md">
        <span className="text-3xl font-bold">4.3</span>
        <div className="h-10 w-px bg-white"></div>
        <div className="flex flex-col gap-2 leading-tight">
          <div className="h-1 w-10 bg-white/50 rounded-sm"></div>
          <span className="text-xs text-white/90">Basée sur 123 avis</span>
        </div>
        <div className="h-10 w-px bg-white"></div>
        <div>
          <img src="./hero-logo-google.png" className="w-8" alt="Google Logo" />
        </div>
      </div>

      {/* Affichage de l'image actuelle */}
      <div className="w-full h-full transition-transform duration-500 ease-in-out">
        <img
          src={slides[currentIndex].url}
          alt={slides[currentIndex].alt}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Indicateurs (Dots) */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`
              w-3 h-3 rounded-full cursor-pointer transition-all duration-300 
              ${
                currentIndex === slideIndex
                  ? "bg-white opacity-90"
                  : "bg-white opacity-40 mix-blend-difference"
              }
            `}
            aria-label={`Aller à la diapositive ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;