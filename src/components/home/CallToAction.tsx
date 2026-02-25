import React from "react";
import { Sparkles } from "lucide-react";
import StyledTitle from "./StyledTitle";

const CallToAction = () => {
  return (
    <div className="relative w-full overflow-hidden bg-white py-30 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[400px]">

      <img
        src="./CallToAction-etoile.png"
        className="absolute left-[20%] w-[10vw] bottom-5"
        alt=""
      />

      <img
        src="./CallToAction-etoile.png"
        className="absolute -left-10 w-[20vw] bottom-10"
        alt=""
      />

      <img
        src="./CallToAction-flech.png"
        className="absolute h-[14vw] -rotate-12 bottom-10 -right-10"
        alt=""
      />
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <StyledTitle text="Prêt à découvrir votre avenir ?" />

        <p className="text-primary font-medium text-lg my-10 leading-relaxed max-w-2xl mx-auto">
          Faites le premier pas dès aujourd'hui.
          <br className="hidden md:block" />
          Lancez votre test d'orientation et laissez Jane vous guider vers votre
          réussite.
        </p>

        {/* Zone du Bouton avec les griffonnages (Doodles) */}
        <div className="relative inline-flex items-center justify-center">
          {/* Flèche dessinée à la main (Gauche) */}
          <img
            src="./CallToAction-image2.png"
            className="absolute h-16 -left-24 -top-6 rotate-x-180"
            alt=""
          />

          {/* Le Bouton Principal */}
          <button
            className="flex items-center gap-2 text-white text-lg px-6 py-3 rounded-xl uppercase transition font-medium text-center leading-5 focus:outline-hidden"
            style={{
              background:
                "linear-gradient(90deg, #C74CFC, #7167FF, #A176FB, #FF75FA, #DC3EF4)",
            }}
          >
            COMMENCER
            <Sparkles className="w-1 h-1 text-white" fill="currentColor" />
          </button>

          <img src="./CallToAction-image.png" className="absolute -right-10 -bottom-10 w-12 rotate-180" alt="" />

        </div>
      </div>
    </div>
  );
};

export default CallToAction;