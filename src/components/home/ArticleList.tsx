"use client";

import React, { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";
import type { ArticleProps } from "./ArticleCard";

const isSmallScreen = (): boolean => {
  return typeof window !== "undefined" && window.innerWidth < 640;
};

export default function ArticleListSection(): React.JSX.Element {
  const customTags: string[] = ["Business", "Conseils", "Projet"];

  const [isSmall, setIsSmall] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const articles: ArticleProps[] = [
    {
      imageUrl: "/path/to/your/image.jpg",
      title: "Réussir son projet en 10 étapes clé",
      date: "29/10/2024",
      tags: customTags,
      gradientColorClass: "from-fuchsia-500/80 to-purple-800/80",
    },
    {
      imageUrl: "/path/to/your/image.jpg",
      title: "Les secrets d’une bonne organisation",
      date: "20/11/2024",
      tags: customTags,
      gradientColorClass: "from-rose-500/80 to-red-800/80",
    },
    {
      imageUrl: "/path/to/your/image.jpg",
      title: "Les secrets d’une bonne organisation",
      date: "20/11/2024",
      tags: customTags,
      gradientColorClass: "from-rose-500/80 to-red-800/80",
    },
    {
      imageUrl: "/path/to/your/image.jpg",
      title: "Les secrets d’une bonne organisation",
      date: "20/11/2024",
      tags: customTags,
      gradientColorClass: "from-rose-500/80 to-red-800/80",
    },
  ];

  const totalArticles = articles.length;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSmall(isSmallScreen());

      const handleResize = (): void => {
        setIsSmall(isSmallScreen());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalArticles);
  };

  const handlePrev = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalArticles) % totalArticles);
  };

  if (isSmall) {
    return (
      <div className="mt-16 flex flex-col items-center">
        <div className="relative w-full max-w-sm px-4">
          <div className="flex justify-center">
            <ArticleCard {...articles[currentIndex]} />
          </div>
          <div className="w-full flex justify-center gap-5 mt-10">
            <button
              onClick={handlePrev}
              className="p-2 hover:bg-gray-100/50 text-white rounded-full z-10"
              aria-label="Article précédent"
            >
              <svg width="40" height="40" viewBox="0 0 24 24">
                <polygon points="18,4 6,12 18,20" fill="#681bff" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="p-2 hover:bg-gray-100/50 text-white rounded-full z-10"
              aria-label="Article suivant"
            >
              <svg width="40" height="40" viewBox="0 0 24 24">
                <polygon points="6,4 18,12 6,20" fill="#681bff" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-[18px] mt-16 justify-center flex-wrap">
      {articles.map((a, index) => (
        <ArticleCard key={index} {...a} />
      ))}
    </div>
  );
}