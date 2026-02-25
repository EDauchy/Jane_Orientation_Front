import React, { useState, useEffect, useRef } from 'react';

export default function LearnMoreButton() {
  const slowDuration = 35; // durée en secondes pour un tour complet
  const fastDuration = 10; // durée en secondes pour un tour complet

  const [rotationSpeed, setRotationSpeed] = useState<number>(slowDuration);
  const rotateRef = useRef<number>(0); // rotation actuelle en degrés
  const requestRef = useRef<number | null>(null);

  // Animation manuelle pour rotation fluide
  const animate = (time: number) => {
    // On approxime 60fps pour le calcul
    rotateRef.current += (1 / rotationSpeed) * 360 / 60;

    const rotateElement = document.querySelector<HTMLElement>('.rotate-text');
    if (rotateElement) {
      rotateElement.style.transform = `rotate(${rotateRef.current}deg)`;
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [rotationSpeed]);

  return (
    <div
      className="group w-[115px] h-[115px] relative flex items-center justify-center"
      onMouseEnter={() => setRotationSpeed(fastDuration)}
      onMouseLeave={() => setRotationSpeed(slowDuration)}
    >
      {/* Cercle extérieur */}
      <div className="absolute inset-0 rounded-full border-4 border-purple-600"></div>

      {/* Texte circulaire */}
      <div className="absolute inset-0 rotate-text">
        <svg viewBox="0 0 240 240" className="w-full h-full">
          <defs>
            <path
              id="circlePath"
              d="
                M120,120
                m-80,0
                a80,80 0 1,1 160,0
                a80,80 0 1,1 -160,0
              "
            />
          </defs>
          <text fill="black" fontSize="28" fontWeight="400" letterSpacing="1">
            <textPath href="#circlePath" startOffset="0">
              • EN SAVOIR PLUS • EN SAVOIR PLUS
            </textPath>
          </text>
        </svg>
      </div>

      {/* Cercle intérieur */}
      <div className="absolute w-[60px] h-[60px] rounded-full border-[3px] border-purple-600"></div>

      {/* Flèche */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-12 text-purple-600 transition-transform duration-300 group-hover:scale-110"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5v14m0 0l-5-5m5 5l5-5"
        />
      </svg>
    </div>
  );
}
