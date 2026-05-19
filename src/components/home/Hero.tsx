import { Info, Sparkles } from "lucide-react";
import ImageSlider from "./ImageSlider";
import FollowUsCard from "./FollowUsCard";
import PowerByApisCard from "./PowerByApisCard";
import { useEffect, useState } from "react";
import { APP_CONFIG } from "../../constants/config";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [isLocked, setIsLocked] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date().getTime();
      const target = new Date(APP_CONFIG.TARGET_DATE).getTime();

      setIsLocked(now < target);
    };

    checkStatus();
    const timer = setInterval(checkStatus, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full px-11 py-5 flex flex-col-reverse overflow-x-hidden lg:flex-row">
      <div className="w-full lg:w-1/2 pt-10 lg:pt-[90px] lg:pr-4 pr-0 ">
        <div className="headline lg:text-[2.5vw] md:text-[4vw] text-[4vw]">
          <div>
            <div className="relative hidden md:inline-block top-1  h-[35px] w-[23px]  border-4 border-primary rounded-full  text-primary mr-2 ">
              <svg
                width="17"
                height=""
                className=" rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 4 L7 12 L15 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="absolute hidden md:block left-full top-1/2 w-5 border-t-4 border-primary border-dashed"></div>
            </div>
            <span className="word-wavy">DESSINEZ VOTRE</span>
            <span className="word-orange-outline"> PARCOURS </span>
          </div>
          <div>
            <span className="word-orange-outline"> ET </span>
            <span className="word-wavy">AVENIR</span>
            <span className="word-orange-outline"> EN RÉALISANT VOS</span>
          </div>

          <div>
            <span className="word-orange-outline"> RÊVES. FAITES </span>
            <span className="word-wavy">UN CHOIX À LA</span>
          </div>

          <div>
            <span className="word-orange-outline">
              {" "}
              HAUTEUR DE VOS AMBITIONS{" "}
            </span>
          </div>

          <div>
            <span className="word-orange-outline">UNE ÉTAPE À LA</span>
            <span className="relative word-outline-box word-wavy">
              FOIS
              <div
                className="hidden md:block
              absolute left-full top-1/2 z-5 w-[320px] 
              h-[4px] 
              bg-linear-to-r from-[#f8a128] to-primary
              mask-[linear-gradient(to_right,black_60%,transparent_40%)]
              mask-size-[13px_100%]
              mask-repeat-x
            "
              ></div>{" "}
              <div className="absolute md:block hidden -right-16 top-1 w-10 h-10 z-10 flex items-center justify-center">
                <div className="absolute inset-[2px] bg-[#f8a128]/40 rounded-full"></div>

                <div className="absolute inset-[9px] bg-[#f8a128]/60 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#f8a128] rounded-full shadow-[0_0_8px_rgba(248,161,40,0.9)]"></div>
                </div>
              </div>{" "}
              <div className="absolute md:block hidden -right-[calc(320px)] top-1/2 w-0 z-5 h-[calc(50%+80px)] border-l-4 border-primary border-dashed"></div>
              <div className="absolute hidden md:block -right-[320px] top-[calc(100%+80px)] z-5 h-0 w-[300px] border-t-4 border-primary border-dashed rotate-180"></div>
            </span>
          </div>
        </div>

        <div className="flex items-center  md:h-[160px] h-[220px] md:w-[90%] w-[100%] ">
          <div className="relative shadow-md p-6 z-10 bg-white rounded-2xl border border-gray-100 ">
            <div className="flex items-start gap-1">
              <Info className="w-5 h-5 text-primary shrink-0 mt-1" />

              <p className="text-sm md:text-sm lg:text-base text-primary font-semibold leading-relaxed">
                Grâce à
                <span className="font-bold text-primary">
                  {" "}
                  l'intelligence artificielle
                </span>
                ,<span className="font-bold text-primary"> Jane </span>
                vous
                <span className="font-bold text-primary"> guide </span>
                pour
                <span className="font-bold text-primary"> explorer</span>,
                <span className="font-bold text-primary"> choisir </span> et
                <span className="font-bold text-primary"> réussir </span>
                un parcours sur mesure
                <span className="font-bold text-primary">
                  {" "}
                  qui vous ressemble.{" "}
                </span>
              </p>
            </div>

            <div
              className="absolute top-0 right-0 h-full w-4 rounded-r-2xl"
              style={{
                background: "#681bff",
                borderLeft: "1px solid #681bff",
              }}
            ></div>
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute hidden md:block top-[calc(50%-16px)] -right-4 z-50"
            >
              <polygon points="10,4 18,12 10,20" fill="#681bff" />
            </svg>
          </div>
        </div>

        <div className="flex justify-center lg:justify-start">
          <button
            onClick={() => navigate("/quiz")}
            className={`flex items-center gap-2 text-white text-base md:text-sm px-6 py-3 rounded-xl uppercase transition font-medium text-center leading-5 focus:outline-hidden"
                    ${
                      isLocked
                        ? "opacity-50 cursor-not-allowed grayscale"
                        : "opacity-100 cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
                    }
      `}
            style={{
              background:
                "linear-gradient(90deg, #C74CFC, #7167FF, #A176FB, #FF75FA, #DC3EF4)",
            }}
          >
            COMMENCER
            <Sparkles className="w-5 h-5 text-white" fill="currentColor" />
          </button>
        </div>

        <div className="flex lg:flex-row flex-col gap-5 mt-12">
          <FollowUsCard />
          <PowerByApisCard />
        </div>
      </div>

      <div className="lg:w-1/2 w-full flex gap-[20px]">
        <ImageSlider />

        <div className="hidden lg:flex w-[220px] flex-col">
          <div className="">
            <div className="relative flex flex-col w-[220px] h-[230px] rounded-tl-[30px] bg-amber-200 overflow-hidden">
              <div className="absolute top-0 right-0 z-10 w-[120px] h-[120px] bg-white rounded-bl-[30px]"></div>
              <div className="absolute right-0 top-0 w-[150px] h-[30px] bg-[radial-gradient(circle_at_bottom_left,transparent_30px,#ffffff_30.5px)]"></div>{" "}
              <div className="absolute right-0 top-0 w-[30px] h-[150px] bg-[radial-gradient(circle_at_bottom_left,transparent_30px,#ffffff_30.5px)]"></div>{" "}
              <img
                src="img-homme.png"
                alt=""
                className="w-full h-full object-cover"
              />
              <div>
                <div className="absolute flex gap-2 bottom-4 left-4 text-black text-[11px] font-bold">
                  <span className="bg-white px-4 py-1 rounded-full text-primary">
                    MARC
                  </span>
                  <span className=" px-4 py-1 rounded-full bg-[#FF5EAE] text-white">
                    29 ANS
                  </span>
                </div>
              </div>
            </div>

            <div className="relative w-[220px] h-[120px] rounded-b-[30px] overflow-hidden">
              <img
                src="img-femme.png"
                alt=""
                className="w-full h-full object-cover"
              />
              <div>
                <div className="absolute flex gap-2 bottom-4 left-4 text-black text-[11px] font-bold">
                  <span className="bg-white px-4 py-1 rounded-full text-primary">
                    Léa
                  </span>
                  <span className=" px-4 py-1 rounded-full bg-[#FF5EAE] text-white">
                    17 ANS
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex-1 h-10 ">
            <img
              src="./hero-arrow.png"
              className="absolute -top-10 bottom-0 h-[calc(100%+40px)] -right-10 rotate-170"
              alt=""
            />
          </div>

          <div className="">
            <p className="text-2xl font-normal">
              <span className="text-[#681BEF]">Découvrez </span>
              <span className="text-[#FF5EAE] font-bold">
                {" "}
                les témoignages{" "}
              </span>
              <span className="text-[#681BEF]">de ceux qui ont</span>
              <span className="text-[#FF5EAE] font-bold"> changé de vie</span>
            </p>
            <div className="h-5"></div>

            <span className="text-base">
              <span className="text-[#681BEF]">Laissez-vous</span>
              <span className="text-[#FF5EAE] font-bold relative">
                <img
                  src="./hero-wow.png"
                  className="absolute w-5 -right-5 rotate-y-180 -top-2"
                  alt=""
                />{" "}
                inspirer
              </span>
              <span className="text-[#681BEF]">.</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
