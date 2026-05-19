import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import ArticleCard from "../components/home/ArticleCard";
import { Filter, ArrowUpDown } from "lucide-react";
import { useDevToArticles, toCardProps } from "../lib/useDevToArticles";

export default function Blog() {
  const { articles, loading } = useDevToArticles(8);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
        <h1 className="font-montserrat font-black text-primary text-3xl md:text-4xl uppercase text-center leading-tight mb-6">
          L'avenir appartient à ceux qui choisissent en connaissance
        </h1>

        <hr className="border-primary/20 mb-6" />

        <div className="flex justify-end gap-2 mb-8">
          <button className="flex items-center gap-1.5 border border-brand-pink text-brand-pink font-montserrat font-semibold text-xs px-3 py-1.5 rounded-full uppercase hover:bg-brand-pink/10 transition-colors">
            <Filter className="w-3 h-3" />
            Filtrer
          </button>
          <button className="flex items-center gap-1.5 border border-brand-pink text-brand-pink font-montserrat font-semibold text-xs px-3 py-1.5 rounded-full uppercase hover:bg-brand-pink/10 transition-colors">
            <ArrowUpDown className="w-3 h-3" />
            Trier
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-[18px]">
            {articles.map((article, i) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ArticleCard {...toCardProps(article, i)} />
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
