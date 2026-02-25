import React from "react";
import StyledTitle from "./StyledTitle";
import type { CustomSectionProps } from "../../shard/types";


const CustomSection: React.FC<CustomSectionProps> = ({ title, children }) => {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* Fond décoratif (Background Text) */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="
            text-[8rem] md:text-[12rem] lg:text-[12rem]
            font-black 
            uppercase 
            leading-[0.8]
            text-transparent 
            tracking-[-0.08em]
            opacity-10
            whitespace-pre-line
            [-webkit-text-stroke:5px_#671bff9b]
            "
        >
          {title}
        </span>
      </div>

      {/* Contenu principal */}
      <div className="w-full z-10">
        <StyledTitle text={title} />

        <div className="w-full">{children}</div>
      </div>
    </section>
  );
}

export default CustomSection;