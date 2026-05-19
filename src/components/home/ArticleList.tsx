import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useDevToArticles, toCardProps } from "../../lib/useDevToArticles";

const isSmallScreen = (): boolean =>
  typeof window !== "undefined" && window.innerWidth < 640;

export default function ArticleListSection(): React.JSX.Element {
  const { articles } = useDevToArticles(4);
  const [isSmall, setIsSmall] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsSmall(isSmallScreen());
    const handleResize = () => setIsSmall(isSmallScreen());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (articles.length === 0) {
    return (
      <div className="flex justify-center py-16 mt-16">
        <div className="w-8 h-8 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isSmall) {
    return (
      <div className="mt-16 flex flex-col items-center">
        <div className="relative w-full max-w-sm px-4">
          <div className="flex justify-center">
            <a href={articles[currentIndex].url} target="_blank" rel="noopener noreferrer">
              <ArticleCard {...toCardProps(articles[currentIndex], currentIndex)} />
            </a>
          </div>
          <div className="w-full flex justify-center gap-5 mt-10">
            <button
              onClick={() => setCurrentIndex((p) => (p - 1 + articles.length) % articles.length)}
              className="p-2 hover:bg-gray-100/50 rounded-full z-10"
              aria-label="Article précédent"
            >
              <svg width="40" height="40" viewBox="0 0 24 24">
                <polygon points="18,4 6,12 18,20" fill="#681bff" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex((p) => (p + 1) % articles.length)}
              className="p-2 hover:bg-gray-100/50 rounded-full z-10"
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
      {articles.map((article, i) => (
        <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer">
          <ArticleCard {...toCardProps(article, i)} />
        </a>
      ))}
    </div>
  );
}
