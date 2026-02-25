
// Les chemins d'accès aux images sont des exemples. 
// Remplacez-les par les chemins réels dans votre projet.
const PowerByApisCard = () => {

    return (
        <div 
            className="lg:w-1/2 w-full bg-[#37cd8e] shadow-[0px_2px_8px_rgba(99,99,99,0.2)] rounded-2xl pt-6 pb-4 px-6 flex flex-col  lg:gap-0 gap-8 justify-between"  
        >
            
            {/* --- Section Supérieure (Texte) --- */}
            <div className="flex items-center text-white text-md font-bold">
                <p className="mr-2">Propulsé par</p>
                {/* Conteneur "les API" avec bordure blanche */}
                <div className="border-3 border-white rounded-full px-2 text-base font-bold">
                    les API
                </div>
            </div>

            {/* --- Section Inférieure (Logos) --- */}
            <div className="flex items-center flex-nowrap md:flex-wrap sm:flex-wrap space-x-4">
                
                {/* Logo OpenAI (Dimensions ajustées) */}
                <img 
                    src={"./openai_logo.png"} 
                    alt="Logo OpenAI" 
                    className="h-7" 
                />

                {/* Logo Onisep (Dimensions ajustées) */}
                <img 
                    src={"./onisep_logo.png"} 
                    alt="Logo ONISEP" 
                    className="h-7" 
                />

                 <img 
                        src={"./crous_logo.png"} 
                        alt="Logo Les Crous" 
                        className="h-12"
                    />
            </div>

        </div>
    );
};

export default PowerByApisCard;