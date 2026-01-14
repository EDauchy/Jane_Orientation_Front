import type { ReactNode } from "react";
import SocialLinks from "./SocialLinks";

interface TitleProps {
  children: ReactNode;
}
export default function Footer() {
  // Sous-composant avec typage TypeScript pour les enfants
  const Title = ({ children }: TitleProps) => (
    <div className="relative inline-flex items-center pb-1 w-fit mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 rotate-45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
      </svg>

      <span className=" text-white font-bold text-xl">{children}</span>

      {/* Ligne sous le contenu à 80% */}
      <div className="absolute bottom-0 left-0 w-[80%] h-[2px] bg-white"></div>
    </div>
  );

  return (
    <>
      <div className="relative w-full flex p-10 ">
        <div className="xl:w-2/3 lg:w-3/5 md:w-1/2 bg-[#681bff] rounded-[25px] rounded-br-none p-7 pb-20 ">
          {/* Colonne 1 */}
          <div className="grid grid-cols-2 gap-y-20 gap-x-26 w-fit md:gap-16">
            <div className="flex flex-col text-white gap-2  w-fit">
              <Title>INFORMATIONS</Title>
              <a href="">FAQ</a>
              <a href="">A propos</a>
              <a href="">Témoignage</a>
            </div>

            {/* Colonne 2 */}
            <div className="flex flex-col text-white gap-2">
              <Title>SUPPORT</Title>
              <a href="">Contact</a>
              <a href="">Centre d'aide</a>
              <a href="">Conditions générales</a>
            </div>

            {/* Colonne 3 */}
            <div className="flex flex-col text-white gap-2">
              <Title>RESSOURCES</Title>
              <a href="">Blog</a>
              <a href="">Guides et conseils</a>
              <a href="">Actualités</a>
            </div>

            {/* Colonne 4 */}
            <div className="flex flex-col text-white gap-2">
              <Title>LÉGAL</Title>
              <a href="">Mentions légales</a>
              <a href="">Politique de Confidentialité</a>
              <a href="">Politique de cookies</a>
            </div>
          </div>
        </div>
        
        <div className="h-full "></div>
        
        <div className="xl:w-1/3 lg:w-2/5 md:w-1/2 flex flex-col  ">
          <div className="flex-1 pb-5 pl-5">
            <div className="flex flex-col gap-3 bg-[#74F3BF] py-10 px-6 h-full rounded-[25px]">
              <h2 className="text-xl font-extrabold uppercase text-[#681bff]">
                Faites le bon choix avant tout le monde
              </h2>
              <p className="text-[#681bff] text-sm">
                <span className="ml-0.5 px-1 rounded-lg border-3 border-[#681bff] font-bold shadow-md inline-block mt-1 ">
                  Inscrivez-vous à notre newsletter
                </span>{" "}
                et ouvrez la porte à des conseils{" "}
                <span className="font-bold">exclusifs, </span>
                des
                <span className="font-bold"> inspirations</span> inattendues et
                des <span className="font-bold">opportunités</span> qui
                pourraient{" "}
                <span className="px-1 rounded-full border-3 border-[#681bff] font-bold">
                  changer votre avenir
                </span>
              </p>

              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="nom@email.fr"
                  className="
                py-3 px-2
                flex-1
                text-base 
                text-purple-600 
                placeholder:text-purple-400 
                bg-white 
                border-none 
                rounded-2xl
                shadow-lg  
                focus:outline-hidden 
                focus:ring-2 focus:ring-purple-500
            "
                />

                <button
                  className="
                bg-[#681BEF] 
                text-white 
                font-bold 
                 px-5
                text-sm
                rounded-2xl 
                shadow-lg 
                flex items-center space-x-2 
                transition duration-150
            "
                >
                  <span>ENVOYER</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 rotate-90"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="relative flex flex-col justify-between items-end bg-[#681bff] rounded-r-[25px] p-3 text-white">
            <div className="flex flex-col gap-3 items-end text-sm">
              <div>
                <img
                  src="./jane-orientation-logo-white.png"
                  className="h-10"
                  alt="Logo Jane Orientation"
                />
              </div>

              <div className="flex flex-col items-end">
                <span>00 Rue de l'Adresse</span>
                <span>59000 Lille, France</span>
              </div>

              <div className="flex flex-col items-end">
                <span>contact@janeorientation.fr</span>
                <span>01 23 45 67 89</span>
              </div>
            </div>

            <div className="mt-5 flex space-x-3 sm:space-x-4">
              <SocialLinks color="#FFFFFF" />
            </div>

            <div className="absolute left-0 bottom-[25px] w-[25px] h-full bg-[radial-gradient(circle_at_top_right,transparent_25px,#681bff_25px)]"></div>
            <img
              src="./homme-fauteuil-roulant.png"
              className="absolute bottom-0 rotate-y-180 right-[50%] w-[300px] sm:hidden"
              alt="Illustration"
            />
          </div>
        </div>
      </div>
    </>
  );
}