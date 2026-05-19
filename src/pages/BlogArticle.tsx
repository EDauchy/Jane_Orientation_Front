import { useParams } from "react-router-dom";

import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

const articles: Record<
  string,
  {
    title: string;
    date: string;
    tags: string[];
    img: string;
    author: string;
    authorImg: string;
    content: { heading: string; body: string }[];
  }
> = {
  "1": {
    title: "Maîtrisez l'IA avec Microsoft",
    date: "15/01/2025",
    tags: ["FORMATION GRATUITE", "IA", "MICROSOFT"],
    img: "/img-homme.png",
    author: "Jack Bryant",
    authorImg: "/img-homme.png",
    content: [
      {
        heading: "5 astuces pour rester productif en travaillant de chez soi :",
        body: "Ces derniers temps, le travail à distance est devenu une réalité pour beaucoup d'entre nous. Bien que cela puisse sembler idéal — pyjama, café maison et zéro trajet — travailler de chez soi peut présenter des défis. Voici cinq astuces simples pour booster votre productivité tout en profitant des avantages du travail à distance.",
      },
      {
        heading: "1. Aménagez un espace de travail dédié",
        body: "Créez un coin spécial pour travailler, même si vous vivez dans un petit espace. Cela aide à créer une séparation mentale entre travail et loisirs. Assurez-vous que cet espace soit ergonomique et bien éclairé.",
      },
      {
        heading: "2. Définissez une routine quotidienne",
        body: "Il peut être tentant de commencer votre journée à un rythme plus lent, mais une routine stricte permet de structurer votre journée. Fixez des horaires pour commencer et terminer votre travail, ainsi que des pauses régulières pour recharger vos batteries.",
      },
      {
        heading: "3. Minimisez les distractions",
        body: "Les distractions à la maison peuvent rapidement s'accumuler. Identifiez vos sources de distraction principales et prenez des mesures pour les éviter. Par exemple, utilisez des applications de blocage de sites si les réseaux sociaux sont une tentation.",
      },
      {
        heading: "4. Fixez des objectifs clairs",
        body: "Chaque matin, écrivez une liste des tâches que vous voulez accomplir dans la journée. Cela vous permettra de rester concentré et de suivre vos progrès. Divisez les grandes tâches en petites étapes pour les rendre plus accessibles.",
      },
      {
        heading: "5. Prenez soin de vous",
        body: "Enfin, n'oubliez pas de vous accorder du temps pour vous. Faites de l'exercice, mêlez équilibré et prenez des pauses pour éviter l'épuisement. Un esprit reposé et un corps en bonne santé sont essentiels pour rester productif.",
      },
      {
        heading: "",
        body: "En suivant ces conseils, vous pouvez transformer votre expérience de travail à distance en un moment agréable et productif. N'oubliez pas que chaque personne est différente, alors n'hésitez pas à adapter ces astuces à votre propre situation et à trouver ce qui fonctionne le mieux pour vous.",
      },
    ],
  },
  "2": {
    title: "Comment trouver une alternance ?",
    date: "25/11/2024",
    tags: ["TRAVAIL", "ALTERNANCE"],
    img: "/img-femme.png",
    author: "Sophie M.",
    authorImg: "/img-femme.png",
    content: [
      {
        heading: "Introduction",
        body: "Trouver une alternance peut sembler difficile, mais avec les bonnes stratégies, vous maximiserez vos chances de succès.",
      },
      {
        heading: "1. Préparez votre CV",
        body: "Un CV clair et bien structuré est la première étape pour décrocher une alternance. Mettez en avant vos compétences et expériences pertinentes.",
      },
      {
        heading: "2. Utilisez les plateformes spécialisées",
        body: "Des sites comme Indeed, LinkedIn ou encore les bourses d'alternance de votre école sont des ressources précieuses pour trouver des offres.",
      },
    ],
  },
};

export default function BlogArticle() {
  const { id } = useParams<{ id: string }>();
  const article = id ? articles[id] : null;

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400 font-montserrat font-black text-xl">
            Article introuvable.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24">
      <Header />

      <main className="pt-28 pb-16 px-4 md:px-10 lg:px-16">
        <div className="relative rounded-4xl overflow-visible">
          {/* ── Purple back bar — full width top of card ── */}
          <div className="absolute -top-14 right-0 h-16 overflow-hidden rounded-2xl px-6 bg-primary w-[80%] flex justify-center items-center">
            <img src="/arrow.svg" alt="Purple decorative bar" />
            {/* Inverse rounded corner bottom-right */}
            <div
              className="absolute -bottom-5 right-0 w-5 h-5"
              style={{
                background:
                  "radial-gradient(circle at top right, transparent 20px, #681BEF 20.5px)",
              }}
            />
          </div>

          {/* ── Article image — overlaps outside card + over the bar ── */}
          <div
            className="absolute -top-17 left-10 z-10 w-48 h-52"
            style={{
              filter:
                "drop-shadow(-8px 0 0 white) drop-shadow(8px 0 0 white) drop-shadow(0 -8px 0 white) drop-shadow(0 8px 0 white)",
            }}
          >
            <img
              src="/blog-article.svg"
              alt={article.title}
              className="w-full h-full"
              style={{ transform: "scale(0.92)" }}
            />
          </div>

          {/* ── BODY ── */}
          <div className="flex rounded-4xl">
            {/* Left sidebar — author info + tags */}
            <div className="w-52 shrink-0 px-2 pt-32 pb-5 flex flex-col gap-3 items-end">
              <div className="flex items-center gap-3 rounded-l-lg bg-white pl-3">
                <div className="min-w-0">
                  <p className="font-montserrat font-black text-primary text-[11px] uppercase leading-tight tracking-wider">
                    {article.author}
                  </p>
                  <p className="font-roboto text-pink-300 text-[11px] mt-0.5">
                    {article.date}
                  </p>
                </div>
                <img
                  src={article.authorImg}
                  alt={article.author}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1 justify-end">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary text-white text-[8px] font-montserrat font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Article content — scrollable */}
            <div
              className="flex-1 overflow-y-auto max-h-145 pb-8 rounded-tr-none mt-7 pt-8 py-5 scroll-smooth bg-white shadow-lg rounded-xl px-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`div::-webkit-scrollbar { display: none; }`}</style>

              <h1 className="font-montserrat font-black text-primary text-[28px] md:text-[32px] uppercase text-center mb-6 leading-[1.15] tracking-wide">
                {article.title}
              </h1>

              <div className="space-y-5 text-justify">
                {article.content.map((section, i) => (
                  <div key={i}>
                    {section.heading && (
                      <p className="font-montserrat font-semibold text-primary text-[13.5px] mb-1">
                        {section.heading}
                      </p>
                    )}
                    <p className="font-roboto text-primary text-[13.5px] leading-[1.7]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
