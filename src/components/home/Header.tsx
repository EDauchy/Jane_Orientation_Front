"use client";

import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { label: "ACCUEIL", section: "features" },
    { label: "BLOG", section: "about" },
    { label: "À PROPOS", section: "testimonials" },
    { label: "TESTIMONIALS", section: "testimonials" },
    { label: "FAQ", section: "testimonials" },
  ];

  // Correction : Définition de la fonction de scroll
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false); // Ferme le menu mobile après le clic
  };

  return (
    <header className="absolute top-0 w-full z-50 transition">
      <nav className="lg:px-12 py-6 flex w-full">
        {/* Partie gauche */}
        <div className="flex items-center w-1/2 h-[45px]">
          {/* Logo */}
          <div>
            <img src="./jane-logo.png" alt="Logo" className="h-10 w-auto" />
          </div>

          {/* Boutons principaux */}
          <div className="hidden md:flex flex-wrap gap-2 ml-3 mr-3">
            {links.map((item, idx) => {
              const isActive = idx === 0;
              return (
                <button
                  key={idx}
                  onClick={() => scrollToSection(item.section)}
                  className={`px-3 py-1 rounded-full text-[10px] uppercase transition
          ${isActive ? "bg-[#681bff] text-white border-[#681bff] font-bold" : "text-[#681bff] border border-[#681bff] hover:bg-[#681bff]/10 font-semibold"}
        `}
                >
                  {item.label}
                </button>
              );
            })}
          </div>


          {/* Bouton violet */}
          <div className="ml-auto pr-7 hidden md:block">
            <button
              className="flex items-center gap-1 text-white text-[10px] px-4 py-1.5 rounded-full uppercase transition font-medium"
              style={{
                background:
                  "linear-gradient(90deg, #C74CFC, #7167FF, #A176FB, #FF75FA, #DC3EF4)",
              }}
            >
              COMMENCER
              <Sparkles
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
              />
            </button>
          </div>
        </div>

        {/* Partie droite */}
        <div className="hidden md:flex w-1/2 justify-between ">
          <div className="relative flex h-[45px] w-[120px] items-center">
            <button
              className="text-white w-[90px] text-[10px] font-semibold px-2 py-1 rounded-full uppercase z-10"
              onClick={() => scrollToSection("contact")}
            >
              CONTACT
            </button>

            <img
              src="./contact-selected.svg"
              alt="icon"
              className="absolute w-[130px] top-0 -left-4"
            />
          </div>

          <button
            onClick={() => scrollToSection("profil")}
            className="w-[100px] h-[100px] flex items-center justify-center bg-[#681bff] rounded-3xl p-5"
          >
            <img src="/user-icon.png" alt="" />
          </button>
        </div>

        {/* MENU BURGER – visible seulement en md et moins */}
        <div className="flex md:hidden ml-auto pr-5">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-[#681bff]" />
            )}
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {isMenuOpen && (
        <>
          {/* 20% BLUR OVERLAY */}
          <div
            className="fixed inset-0  bg-black/30 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          {/* NAVBAR MOBILE 80% */}
          <div className="md:hidden fixed top-0 right-0 bottom-0 w-[80%] rounded-l-4xl bg-[#681bff] text-white  z-50 shadow-xl flex flex-col">
            {/* BOUTON FERMER */}
            <div className="flex justify-end px-[20px] py-[24px]">
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-7 h-7 text-white" />
              </button>
            </div>

            <div className="py-4 px-6">
              {links.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    scrollToSection(item.section);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-sm uppercase font-semibold"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex-1 rounded-4xl bg-white py-4 px-6"></div>
          </div>
        </>
      )}
    </header>
  );
}
