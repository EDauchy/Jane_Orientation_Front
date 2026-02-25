import React from "react";

export interface ArticleProps {
  imageUrl: string;
  title: string;
  date: string;
  tags?: string[]; 
  gradientColorClass?: string;
}

const ArticleCard: React.FC<ArticleProps> = ({
  imageUrl,
  title,
  date,
  tags = [],
  gradientColorClass = "from-fuchsia-500/80 to-purple-800/80",
}) => {
  return (
    <div className="w-75">
      <div className="relative w-full max-w-sm overflow-hidden rounded-[25px] shadow-xl aspect-3/4">
        {/* Image de fond */}
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        {/* Superposition de dégradé */}
        <div className={`absolute inset-0 bg-linear-to-t ${gradientColorClass}`}></div>

        {/* Contenu */}
        <div className="relative flex flex-col h-full p-4 text-white justify-between">
          <div className="flex justify-between items-start">
            <span className="flex items-center space-x-1 bg-white px-2 py-0.5 rounded-full text-xs font-semibold text-gray-800 shadow-xs">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              <span>NOUVEAU ARTICLE</span>
            </span>

            {/* Design complexe des coins */}
            <div className="absolute top-0 right-0 w-26 h-26 p-3 rounded-bl-[30px] bg-white"></div>
            <div className="absolute right-0 top-0 w-[129px] h-[25px] bg-[radial-gradient(circle_at_bottom_left,transparent_25px,#ffffff_25px)]"></div>
            <div className="absolute right-0 top-0 h-[129px] w-[25px] bg-[radial-gradient(circle_at_bottom_left,transparent_25px,#ffffff_25px)]"></div>

            <div className="absolute top-0 right-0 w-22 h-22 p-3 rounded-[25px] bg-primary backdrop-blur-xs shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full rotate-45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22V2M12 2l-10 10M12 2l10 10" />
              </svg>
            </div>
          </div>

          <div className="mt-auto space-y-1">
            <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
              {title}
            </h2>
            <p className="text-sm font-medium opacity-80">{date}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-semibold rounded-full bg-white text-primary uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;