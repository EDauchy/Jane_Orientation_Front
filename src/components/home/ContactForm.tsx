import React from "react";
import SocialLinks from "./SocialLinks";
export default function ContactForm() {
  return (
    <section className=" w-full flex items-center justify-center">

      <div className=" flex w-200 ">
        
        <div className="w-2/3 ">
          <div className="h-25">
           <h2 className="text-center text-4xl font-extrabold uppercase text-[#681bff] [text-shadow:1px_1px_0_#fff] ">
            Besoin d’aide ou de conseils ?
          </h2>
          </div>
          <div className="p-8 bg-[#c8aeff] rounded-[25px] rounded-tr-none mb-8">
            <form className="  space-y-4">
              {/* Nom et Prénom sur la même ligne */}
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Nom Prenom"
                  className="flex-1 px-3 py-2 border rounded-lg border-white focus:outline-hidden focus:ring-2 bg-white focus:ring-[#681bff] placeholder:text-[#c8aeff]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-3 py-2 border rounded-lg border-white focus:outline-hidden focus:ring-2 bg-white focus:ring-[#681bff] placeholder:text-[#c8aeff]"
                />
              </div>

              {/* Objet */}
              <input
                type="text"
                placeholder="Objet"
                className="w-full px-3 py-2 border rounded-lg border-white focus:outline-hidden focus:ring-2 bg-white focus:ring-[#681bff] placeholder:text-[#c8aeff]"
              />

              {/* Message */}
              <textarea
                placeholder="Votre message"
                className="w-full px-3 py-2 border rounded-lg border-white focus:outline-hidden focus:ring-2 bg-white focus:ring-[#681bff] placeholder:text-[#c8aeff] text-gray-800"
                rows={5} 
                aria-label="Votre message" 
              />
            </form>
          </div>
        </div>

        <div className="relative w-1/3 flex flex-col ">
        <div className="absolute -left-[25px] top-[75px] w-[calc(25px)] h-[25px] bg-[radial-gradient(circle_at_top_left,transparent_25px,#c8aeff_25px)] "></div>{" "}
        <div className="absolute left-0 bottom-[55px] w-[calc(25px)] h-[25px] bg-[radial-gradient(circle_at_bottom_right,transparent_25px,#c8aeff_25px)] "></div>{" "}

          <div className="flex-1 bg-[#c8aeff] rounded-[25px] rounded-bl-none text-start p-5 mt-10">
            <div className="h-full bg-[#681bff] px-7 py-12 rounded-[15px]">
              <div className="h-full flex flex-col items-start justify-between text-sm">
                <h3 className="text-xl font-extrabold text-white">NOS INFOS</h3>

                <div className="flex flex-col items-start text-[12px] text-white">
                  <span>00 Rue de l'Adresse</span>
                  <span>59000 Lille, France</span>
                </div>

                <div className="flex flex-col items-start text-[12px] text-white">
                  <span>contact@janeorientation.fr</span>
                  <span>01 23 45 67 89</span>
                </div>
                <div className=" flex space-x-3 sm:space-x-4">
                <SocialLinks color="#FFFFFF" />
              </div>
              </div>

              
            </div>
          </div>
          <div className="h-20 p-4 w-full">
<button
                  className="
                h-9 bg-[#681bff] w-full rounded-xl text-white font-bold uppercase
                flex items-center justify-center space-x-2 
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
    </section>
  );
}
