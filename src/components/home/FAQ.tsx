"use client";

import { useState } from "react";
// Note: ChevronDown n'est pas utilisé dans votre code actuel mais importé, 
// je l'ai laissé au cas où vous souhaiteriez remplacer le SVG manuel.
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  isVisible: boolean;
}

const faqs: FAQItem[] = [
  {
    question: "Qu’est-ce que Jane ?",
    answer:
      "Jane est une application d’orientation alimentée par l’IA, conçue pour vous aider à découvrir vos domaines de prédilection et à choisir votre parcours scolaire ou professionnel idéal.",
  },
  {
    question: "Comment fonctionne le test d’orientation ?",
    answer:
      "Jane analyse vos réponses à une série de questions comportementales et d'intérêts pour établir un profil précis et suggérer des métiers adaptés.",
  },
  {
    question: "Puis-je parler à un professionnel après le test ?",
    answer:
      "Oui, Jane propose une mise en relation avec des conseillers d'orientation pour approfondir les résultats de votre test.",
  },
  {
    question: "À qui s’adresse Jane ?",
    answer:
      "L'application s'adresse aux étudiants en quête de voie, aux adultes en reconversion et à toute personne cherchant une clarté professionnelle.",
  },
  {
    question: "Quels sont les services inclus dans l’application ?",
    answer:
      "Tests d'IA, fiches métiers détaillées, accès à des mentors et suivi personnalisé de votre projet d'orientation.",
  },
];

export default function FAQ({ isVisible }: FAQProps) {
  // Le state peut être un nombre ou null si tout est fermé
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

return (
    <section id="faq" className="animate-section py-24 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
     

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative ">
                <div className="absolute top-0 right-10 rounded-tr-2xl bg-[#6f3ef4] left-0 bottom-0"></div>
                <div className="absolute top-[40px] right-0 rounded-tr-2xl bg-[#6f3ef4] left-0 bottom-0"></div>
                <div
                  className="absolute right-[15px] top-[15px] w-[50px] h-[50px] 
                    bg-[radial-gradient(circle_at_top_right,transparent_25px,#6f3ef4_25px)]"
                ></div>

                <div className="absolute top-0  right-0 rounded-full p-[5px] bg-[#6f3ef4]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-5 h-5 text-white transition-transform duration-300 ${
                      openIndex === index ? "rotate-225" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6l12 12M6 18L18 6"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => toggleFAQ(index)}
                  className="relative top-0 left-0 right-0 bottom-0 w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
                >
                  <span className="font-semibold text-white text-xl pr-4">
                    {faq.question}
                  </span>
                </button>
              </div>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-48" : "max-h-0"
                }`}
              >
                <div className="bg-[#6f3ef4] px-8 pb-6 text-white text-sm leading-relaxed">
                  <div className="h-[2px] w-full bg-white mb-3"></div>
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}