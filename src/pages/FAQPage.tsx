'use client'

import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import FAQ from "../components/home/FAQ";
import StyledTitle from "../components/home/StyledTitle";

export default function Contact() {

    return (
        <>
            <Header />
            <div className="relative w-full h-[400px] overflow-hidden">

                <div className="absolute inset-0 z-20 pointer-events-none 
                    bg-gradient-to-b from-white from-[60px] 
                    via-white/50 via-[80px] 
                    to-black/[0.05] to-[110px]" />


                <div className="bg-center bg-cover h-full opacity-90 brightness-[1.6] bg-[url('./header-FAQ-image.jpg')]" />

            </div>
            <div className="relative -top-2 flex justify-center items-center">

                <StyledTitle text="passer de la question a la conviction" className="absolute [text-stroke:12px_white] [-webkit-text-stroke:12px_white]" />
                <StyledTitle text="passer de la question a la conviction" className="absolute " />

            </div>

            <FAQ isVisible={true} />
            <Footer />
        </>
    );
}
