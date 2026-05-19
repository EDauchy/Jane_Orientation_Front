export type DevArticle = {
  id: number;
  title: string;
  published_at: string;
  tag_list: string[];
  cover_image: string | null;
  social_image: string;
  url: string;
};

export const GRADIENTS = [
  "from-fuchsia-500/80 to-purple-800/80",
  "from-violet-600/80 to-indigo-900/80",
  "from-orange-500/80 to-amber-800/80",
  "from-rose-500/80 to-red-800/80",
  "from-cyan-500/80 to-blue-800/80",
  "from-emerald-500/80 to-teal-800/80",
  "from-pink-500/80 to-fuchsia-900/80",
  "from-yellow-400/80 to-orange-700/80",
];

const img = (seed: number) => `https://picsum.photos/seed/${seed}/400/600`;

const ARTICLES: DevArticle[] = [
  { id: 1,  title: "Bilan de compétences : comment faire le point sur sa carrière ?",        published_at: "2025-03-15", tag_list: ["BILAN", "ORIENTATION"],        cover_image: img(10),  social_image: "", url: "https://www.welcometothejungle.com/fr/articles/bilan-de-competences" },
  { id: 2,  title: "Alternance vs stage : lequel choisir pour son avenir ?",                 published_at: "2025-03-01", tag_list: ["ALTERNANCE", "FORMATION"],     cover_image: img(20),  social_image: "", url: "https://www.letudiant.fr/etudes/alternance/alternance-et-apprentissage/apprentissage-ou-professionnalisation-quelle-formule-d-alternance-choisir.html" },
  { id: 3,  title: "VAE : valoriser son expérience sans passer par l'école",                 published_at: "2025-02-20", tag_list: ["VAE", "CERTIFICATION"],        cover_image: img(30),  social_image: "", url: "https://www.welcometothejungle.com/fr/articles/vae-validation-acquis-experience" },
  { id: 4,  title: "Les métiers qui recrutent en 2025 : le classement complet",              published_at: "2025-02-10", tag_list: ["EMPLOI", "TENDANCES"],         cover_image: img(40),  social_image: "", url: "https://www.letudiant.fr/jobsstages/nos-conseils/emploi-quels-sont-les-metiers-et-les-regions-qui-recrutent-le-plus-en-2026.html" },
  { id: 5,  title: "CPF, Pôle Emploi, OPCO : bien utiliser ses droits à la formation",      published_at: "2025-01-28", tag_list: ["CPF", "DROITS", "FORMATION"],  cover_image: img(50),  social_image: "", url: "https://www.welcometothejungle.com/fr/articles/compte-personnel-formation" },
  { id: 6,  title: "Reconversion professionnelle : par où commencer ?",                      published_at: "2025-01-15", tag_list: ["RECONVERSION", "CARRIÈRE"],    cover_image: img(60),  social_image: "", url: "https://www.welcometothejungle.com/fr/articles/reconversion-professionnelle-conseils-trouver-sa-voie" },
  { id: 7,  title: "Soft skills : ce que les recruteurs recherchent vraiment",               published_at: "2024-12-20", tag_list: ["RECRUTEMENT", "SOFT SKILLS"],  cover_image: img(70),  social_image: "", url: "https://www.welcometothejungle.com/fr/articles/soft-skills-recherche-emploi-recruteurs" },
  { id: 8,  title: "Comment construire un projet professionnel solide après le bac ?",       published_at: "2024-12-05", tag_list: ["BAC", "PROJET PRO"],           cover_image: img(80),  social_image: "", url: "https://www.onisep.fr/Cap-vers-l-emploi/Recherche-d-emploi/construire-son-projet-professionnel" },
  { id: 9,  title: "Bootcamp ou école traditionnelle : quel parcours choisir ?",             published_at: "2024-11-22", tag_list: ["BOOTCAMP", "ÉCOLE"],           cover_image: img(90),  social_image: "", url: "https://www.letudiant.fr/educpros/actualite/aux-etats-unis-les-ecoles-d-informatique-bootcamp-reagissent-aux-critiques.html" },
  { id: 10, title: "Préparer son entretien d'embauche en 7 étapes concrètes",                published_at: "2024-11-10", tag_list: ["ENTRETIEN", "EMPLOI"],         cover_image: img(100), social_image: "", url: "https://www.letudiant.fr/jobsstages/lettres-de-motivation_1/comment-preparer-un-entretien-d-embauche.html" },
  { id: 11, title: "Le mentorat professionnel : comment trouver le bon mentor ?",            published_at: "2024-10-28", tag_list: ["MENTORAT", "RÉSEAU"],          cover_image: img(110), social_image: "", url: "https://www.welcometothejungle.com/fr/articles/mentor-mentorat-carriere" },
  { id: 12, title: "Formations certifiantes en ligne : les meilleures plateformes 2025",     published_at: "2024-10-15", tag_list: ["E-LEARNING", "CERTIFICATION"],  cover_image: img(120), social_image: "", url: "https://www.welcometothejungle.com/fr/articles/certifications-cv" },
];

export function formatDate(raw: string): string {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function useDevToArticles(perPage: number = 8) {
  return {
    articles: ARTICLES.slice(0, perPage),
    loading: false,
    error: null,
  };
}

export function toCardProps(article: DevArticle, index: number) {
  return {
    title: article.title,
    date: formatDate(article.published_at),
    tags: article.tag_list.slice(0, 3).map((t) => t.toUpperCase()),
    imageUrl: article.cover_image ?? "/img-homme.png",
    gradientColorClass: GRADIENTS[index % GRADIENTS.length],
  };
}
