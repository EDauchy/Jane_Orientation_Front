"use client";

import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from 'react-router-dom'
import CountdownSimple from "./CountdownSimple";
import { APP_CONFIG } from "../../constants/config";
import UserDropdown from "./UserDropdown";


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { label: 'ACCUEIL', to: '/' },
    { label: 'BLOG', to: '/blog' },
    { label: 'À PROPOS', to: '/about' },
    { label: 'FAQ', to: '/faq' },
  ]

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


  const location = useLocation();

  const isContactPage = location.pathname === '/contact';

 

  return (
    <header className="absolute top-0 w-full z-50 transition">
      <nav className="lg:px-12 py-6 flex w-full">

        <div className="flex items-center w-1/2 h-[45px]">

          <div className="lg:pl-0 pl-5">
            <img src="./jane-logo.png" alt="Logo" className="h-10 w-auto" />
          </div>


          <div className="hidden md:flex flex-wrap gap-2 ml-3 mr-3">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-full text-[10px] uppercase transition
            ${isActive
                    ? 'bg-primary text-white border-primary font-bold'
                    : 'text-primary border border-primary hover:bg-primary/10 font-semibold'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>




          <div className="ml-auto pr-7 hidden md:block">
            <button
              disabled={isLocked}
              className={`
        relative flex items-center gap-1 text-white text-[10px] px-4 py-1.5 rounded-full uppercase font-medium transition-all duration-300
        ${isLocked
                  ? 'opacity-50 cursor-not-allowed grayscale'
                  : 'opacity-100 cursor-pointer hover:scale-105 active:scale-95 shadow-lg'
                }
      `}
              style={{
                background: "linear-gradient(90deg, #C74CFC, #7167FF, #A176FB, #FF75FA, #DC3EF4)",
              }}
            >

              COMMENCER
              <CountdownSimple containerClass="absolute top-7" fontSize="text-sm" color="black" targetDate={APP_CONFIG.TARGET_DATE} />
              <Sparkles
                className="w-3.5 h-3.5 text-white"
                fill="currentColor"
              />
            </button>
          </div>
        </div>


        <div className="hidden md:flex w-1/2 justify-between ">
          <div className="relative flex h-[45px] w-[120px] items-center">

            <NavLink
              to="/contact"
              className={`flex justify-center w-[90px] text-[10px] font-semibold px-2 py-1 rounded-full uppercase z-10 ${isContactPage ? 'text-white' : 'text-[#ff9500]'
                }`}
            >
              CONTACT
            </NavLink>

            <img
              src={isContactPage ? './contact-selected.svg' : './contact-unselected.svg'}
              alt="icon"
              className="absolute w-[130px] top-0 -left-4"
            />
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-[100px] h-[100px] flex items-center justify-center bg-primary rounded-3xl p-5 lg:mr-0 mr-5 hover:opacity-90 transition-all"
          >
            <img src="/user-icon.png" alt="User" />
            <UserDropdown
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />

          </button>

        </div>

        <div className="flex md:hidden ml-auto pr-5">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <>

          <div
            className="fixed inset-0  bg-black/30 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div className=" md:hidden fixed top-0 right-0 bottom-0 w-[60%] min-w-[260px] rounded-l-4xl bg-primary text-white  z-50 shadow-xl flex flex-col">

            <div className="absolute right-0 top-0 flex justify-end px-[20px] py-[24px]">
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-7 h-7 text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-4 items-start py-6 px-6">
              {links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2 px-5 text-sm uppercase font-semibold border-2 rounded-full
                    ${isActive ? 'text-primary' : 'text-white'} ${isActive ? 'bg-white' : 'text-primary'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>


            <div className="flex-1 rounded-4xl bg-white py-6 px-6">

              <button
                disabled={isLocked}
                className={`
        relative flex items-center gap-1 text-white text-[10px] px-4 py-1.5 rounded-full uppercase font-medium transition-all duration-300
        ${isLocked
                    ? 'opacity-50 cursor-not-allowed grayscale'
                    : 'opacity-100 cursor-pointer hover:scale-105 active:scale-95 shadow-lg'
                  }
      `}
                style={{
                  background: "linear-gradient(90deg, #C74CFC, #7167FF, #A176FB, #FF75FA, #DC3EF4)",
                }}
              >

                COMMENCER
                <CountdownSimple containerClass="absolute top-7" fontSize="text-sm" color="black" targetDate={APP_CONFIG.TARGET_DATE} />
                <Sparkles
                  className="w-3.5 h-3.5 text-white"
                  fill="currentColor"
                />
              </button>
              <div className="lg:flex w-[220px] flex-col">
                <div className="relative flex h-[45px] w-[120px] items-center">

                  <NavLink
                    to="/contact"
                    className={`absolute top-12 flex justify-center w-[90px] text-[10px] font-semibold px-2 py-1 rounded-full uppercase z-60 ${isContactPage ? 'text-white' : 'text-[#ff9500]'
                      }`}
                  >
                    CONTACT
                  </NavLink>

                  <img
                    src={isContactPage ? './contact-selected.svg' : './contact-unselected.svg'}
                    alt="icon"
                    className="absolute w-[100px] z-50 top-10 -left-2"
                  />
                </div>
                <div className="">
                  <div className="relative flex flex-col w-[220px] h-[150px] rounded-tr-[30px] bg-amber-200 overflow-hidden">

                    <div className="absolute top-0 left-0 z-10 w-[100px] h-[80px] bg-white rounded-br-[30px]"></div>
                    <div className="absolute left-0 top-0 w-[130px] h-[30px] bg-[radial-gradient(circle_at_bottom_right,transparent_30px,#ffffff_30.5px)]"></div>{" "}
                    <div className="absolute left-0 top-0 w-[30px] h-[110px] bg-[radial-gradient(circle_at_bottom_right,transparent_30px,#ffffff_30.5px)]"></div>{" "}
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

                  <div className="relative w-[220px] h-[110px] rounded-b-[30px] overflow-hidden">
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
                    className="absolute -top-5 bottom-0 h-[calc(100%+40px)] -right-0 rotate-170"
                    alt=""
                  />
                </div>

                <div className="">
                  <p className="text-lg font-normal">
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
          </div>
        </>
      )}
    </header>
  );
}
