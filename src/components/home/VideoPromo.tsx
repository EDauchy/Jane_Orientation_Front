import React from "react";

const VideoPromo = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center p-10 bg-white gap-10">
      <div className="relative w-full lg:w-1/2 aspect-video overflow-hidden rounded-xl shadow-2xl">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://placehold.co/800x450/302046/ffffff/png?text=Vignette+Vidéo')",
            backgroundColor: "#302046",
          }}
        >
          <div className="absolute inset-0 bg-purple-900 opacity-20"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-xl"
              aria-label="Lire la vidéo"
            >
              <svg
                className="w-8 h-8 md:w-10 md:h-10 text-purple-600 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className="
          flex w-full lg:w-1/2 flex-wrap gap-y-6 gap-x-4
          text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl
          font-extrabold text-white
        "
      >
        {/* SI UNE */}
        <div className="flex items-center justify-center rounded-full 
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            bg-[#681BEF] px-4 sm:px-5 md:px-6">
          <span>SI UNE</span>
        </div>

        {/* FLECHE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            w-8 sm:w-9 md:w-10 lg:w-10 xl:w-12 2xl:w-14
            border-[3px] border-[#681BEF]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-5 md:h-5 lg:h-5 xl:h-6 2xl:h-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#681BEF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
          </svg>
        </div>

        {/* IMAGE VAUT */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            bg-[#681BEF] px-4 sm:px-5 md:px-6">
          <span>IMAGE VAUT</span>
        </div>

        {/* ORANGE CERCLE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            w-8 sm:w-9 md:w-10 lg:w-10 xl:w-12 2xl:w-14
            bg-[#F8A128]">
        </div>

        {/* MILLE MOTS */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            border-[3px] border-[#681BEF] text-[#FF5EAE] px-4 sm:px-5 md:px-6">
          <span>MILLE MOTS</span>
        </div>

        {/* FLECHE LONGUE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            px-4 sm:px-5 md:px-6 bg-[#681BEF]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-5 md:h-5 lg:h-5 xl:h-6 2xl:h-7 w-full"
            viewBox="0 0 122 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12H120" />
            <path d="M121 12l-11-10M121 12l-11 10" />
          </svg>
        </div>

        {/* UNE VIDÉO */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            border-[3px] border-[#F8A128] text-[#F8A128] px-4 sm:px-5 md:px-6">
          <span>UNE VIDÉO</span>
        </div>

        {/* FLECHE ORANGE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            w-8 sm:w-9 md:w-10 lg:w-10 xl:w-12 2xl:w-14
            border-[3px] border-[#FF5EAE]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-5 md:h-5 lg:h-5 xl:h-6 2xl:h-7 rotate-[-135deg]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF5EAE"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
          </svg>
        </div>

        {/* EN DIT */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            bg-[#681BEF] px-4 sm:px-5 md:px-6">
          <span>EN DIT</span>
        </div>

        {/* FLECHE ROSE LONGUE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            px-4 sm:px-5 md:px-6 bg-[#FF5EAE]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-5 md:h-5 lg:h-5 xl:h-6 2xl:h-7 w-full rotate-180"
            viewBox="0 0 140 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12H140" />
            <path d="M140 12l-11-10M140 12l-11 11" />
          </svg>
        </div>

        {/* CERCLE ROSE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            w-8 sm:w-9 md:w-10 lg:w-10 xl:w-12 2xl:w-14
            bg-[#FF5EAE]">
        </div>

        {/* CENT FOIS */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            border-[3px] border-[#F8A128] text-[#681BEF] px-4 sm:px-5 md:px-6">
          <span>CENT FOIS</span>
        </div>

        {/* FLECHE JAUNE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            w-8 sm:w-9 md:w-10 lg:w-10 xl:w-12 2xl:w-14
            border-[3px] border-[#F8A128]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 sm:h-5 md:h-5 lg:h-5 xl:h-6 2xl:h-7 -rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F8A128"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
          </svg>
        </div>

        {/* PLUS */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            border-[3px] border-[#FF5EAE] text-[#FF5EAE] px-4 sm:px-5 md:px-6">
          <span>PLUS</span>
        </div>

        {/* BARRE LONGUE */}
        <div className="flex items-center justify-center rounded-full
            h-8 sm:h-9 md:h-10 lg:h-10 xl:h-12 2xl:h-14
            w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 2xl:w-48
            bg-[#681BEF]">
        </div>

        {/* CERCLE */}
        <div className="flex items-center justify-center rounded-full
            w-7 sm:w-8 md:w-9 lg:w-10 xl:w-12 2xl:w-14
            h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-14
            border-[3px] border-[#681BEF]">
        </div>
      </div>
    </div>
  );
};

export default VideoPromo;
