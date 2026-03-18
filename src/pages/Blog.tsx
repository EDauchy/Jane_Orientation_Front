import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import { Filter, ArrowUpDown } from "lucide-react";

const articles = [
  {
    title: "Maîtrisez l'IA avec Microsoft",
    date: "19/12/2024",
    tags: ["FORMATION GRATUITE", "IA", "MICROSOFT"],
    img: "/img-homme.png",
    accentColor: "bg-brand-pink",
  },
  {
    title: "Comment trouver une alternance ?",
    date: "25/11/2024",
    tags: ["TRAVAIL", "ALTERNANCE"],
    img: "/img-femme.png",
    accentColor: "bg-primary",
  },
  {
    title: "Comment gagner une bataille intérieure",
    date: "08/11/2024",
    tags: ["TIPS", "ÉTUDES"],
    img: "/img-homme.png",
    accentColor: "bg-brand-orange",
  },
  {
    title: "Réussir son projet en 10 étapes clé",
    date: "29/10/2024",
    tags: ["PROJET", "ÉTUDES", "ENTREPRENEURIAT"],
    img: "/img-femme.png",
    accentColor: "bg-secondary",
  },
  {
    title: "Maîtrisez l'IA avec Microsoft",
    date: "19/12/2024",
    tags: ["FORMATION GRATUITE", "IA", "MICROSOFT"],
    img: "/img-homme.png",
    accentColor: "bg-brand-pink",
  },
  {
    title: "Comment trouver une alternance ?",
    date: "25/11/2024",
    tags: ["TRAVAIL", "ALTERNANCE"],
    img: "/img-femme.png",
    accentColor: "bg-primary",
  },
  {
    title: "Comment gagner une bataille intérieure",
    date: "08/11/2024",
    tags: ["TIPS", "ÉTUDES"],
    img: "/img-homme.png",
    accentColor: "bg-brand-orange",
  },
  {
    title: "Réussir son projet en 10 étapes clé",
    date: "29/10/2024",
    tags: ["PROJET", "ÉTUDES", "ENTREPRENEURIAT"],
    img: "/img-femme.png",
    accentColor: "bg-secondary",
  },
];

interface Article {
  title: string;
  date: string;
  tags: string[];
  img: string;
  accentColor: string;
}

const BlogCard = ({ title, date, tags, img, accentColor }: Article) => (
  <div className="relative w-full max-w-sm overflow-hidden rounded-[25px] shadow-xl aspect-3/4">
    {/* Background image */}
    <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover" />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* NEW ARTICLE badge */}
    <div className="absolute top-3 left-3 bg-brand-pink text-white text-[9px] font-montserrat font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
      + Nouveau article
    </div>

    {/* Arrow button */}
    <div className={`absolute top-3 right-3 ${accentColor} w-10 h-10 rounded-xl flex items-center justify-center shadow-md`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </div>

    {/* Bottom content */}
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="font-montserrat font-black text-white text-lg leading-tight mb-1">{title}</h3>
      <p className="font-roboto text-white/70 text-xs mb-2">{date}</p>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-montserrat font-semibold px-2 py-0.5 rounded-full uppercase">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
        {/* Title */}
        <h1 className="font-montserrat font-black text-primary text-3xl md:text-4xl uppercase text-center leading-tight mb-6">
          L'avenir appartient à ceux qui choisissent en connaissance
        </h1>

        {/* Divider */}
        <hr className="border-primary/20 mb-6" />

        {/* Filter / Sort */}
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article, i) => (
            <BlogCard key={i} {...article} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
