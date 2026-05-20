export default function BenefitsSection() {
  return (
    <section className="w-full py-8">
      {/* SECTION PRINCIPALE */}
      <div className="w-full flex flex-col lg:flex-row px-8 lg:px-16 mt-10 gap-5 items-stretch">
        <div className="flex gap-5 flex-1">
          {/* CARD GAUCHE */}
          <div className="relative z-10 w-full lg:w-1/2 flex items-end overflow-hidden">
            <div className="bg-[#FFF93F33] text-primary backdrop-blur-md rounded-3xl px-6 py-12 flex flex-col justify-between">
              <h3 className="md:text-2xl sm:text-xl font-light mb-3">
                PERSONNALISATION AVANCÉE
              </h3>
              <p className="text-sm">
                Grâce à notre IA, découvrez des recommandations adaptées à vos
                compétences, intérêts et aspirations.
              </p>
            </div>

            <img
              src="./benefits-ampoule.png"
              className="absolute w-20 -bottom-5 right-5 opacity-[0.15] z-10"
              alt="bulb"
            />
          </div>

          <div className="w-1/2 relative rounded-3xl shrink-0 overflow-visible">
            <div className="w-full h-full">
              <div className="h-full overflow-hidden rounded-3xl">
                <img
                  src="/Benefits-girlwithbg.jpg"
                  alt="Étudiante souriante"
                  className="relative -top-[15%] w-full h-[120%] object-cover rounded-3xl"
                />
              </div>

              <div className="absolute w-[400px] h-[500px] -left-[200px] top-0 overflow-hidden">
                <img
                  src="/Benefits-infini-icon.png"
                  alt="infini icon"
                  className="absolute top-1 h-[300px] left-10 object-cover rounded-3xl rotate-100"
                />
              </div>

              <div className="h-full overflow-hidden rounded-3xl">
                <img
                  src="Benefits-girl.png"
                  alt="Benefits girl"
                  className="absolute inset-0 w-full h-[120%] -top-[15%] object-cover overflow-visible z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CARTES À DROITE */}
        <div className="flex gap-5 flex-1">
          <div className="w-full lg:w-1/2 text-white flex flex-col gap-5">
            {/* Bloc violet */}
            <div className="flex-1 bg-[#DC7BFF] z-10 rounded-3xl px-4 py-4 sm:px-4 sm:py-6 md:px-6 md:py-10">
              <h3 className="text-3xl sm:text-4xl md:text-6xl mb-2">*2</h3>
              <p className="text-sm leading-relaxed">
                Faites un test d'orientation, l’IA identifie vos domaines de
                prédilection, puis validez avec un professionnel en deux étapes.
              </p>
            </div>

            {/* Bloc bleu */}
            <div className="relative bg-[#2084F5] rounded-3xl px-4 py-4 sm:px-4 sm:py-6 md:px-6 md:py-10">
              <h3 className="md:text-2xl sm:text-xl font-light mb-3">
                DES EXPERTS À VOS CÔTÉS
              </h3>
              <p className="text-sm leading-relaxed">
                Des professionnels à votre écoute pour vous accompagner à chaque
                étape.
              </p>

              <img
                src="./benefits-cercle.png"
                className="absolute w-[240px] top-28 -right-[120px] opacity-[0.2] z-20"
                alt="cercle"
              />
            </div>
          </div>

          {/* GROS BLOC ORANGE */}
          <div className="relative w-full lg:w-1/2 flex flex-col justify-between items-end bg-[#FF7B42] text-white rounded-3xl px-4 py-4 sm:px-4 sm:py-6 md:px-6 md:py-6 overflow-hidden">
            <img
              src="./benefits-cercle.png"
              className="absolute w-[200px] top-10 -right-[100px] opacity-[0.2]"
              alt="cercle"
            />

            <div>
              <h3 className="md:text-2xl sm:text-xl font-light mb-3">
                DES CHOIX ÉCLAIRÉS POUR UN AVENIR ASSURÉ
              </h3>
              <p className="text-sm leading-relaxed">
                Profitez d’analyses précises pour sélectionner les formations
                qui vous correspondent le mieux.
              </p>
            </div>

            <img
              src="./jane-orientation-logo-white.png"
              className="w-10 mt-4"
              alt="logo jane orientation"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
