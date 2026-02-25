'use client'

import ContactForm from "../components/home/ContactForm";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

export default function Contact() {

    return (
        <>
            <Header />
            <div className="relative w-full h-[400px] overflow-hidden border border-gray-100">

                <div className="absolute inset-0 z-10 mt-18 pointer-events-none 
                bg-gradient-to-b from-white from-[0px] 
                via-white/50 via-[10px] 
                to-white/0 to-[110px]" />
                <iframe
                    title="Ynov Campus Lille"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2528.571190034841!2d3.1465725121652954!3d50.67222177151708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2d52ad64db61b%3A0xb7a8e01a8a006c90!2sYnov%20Campus%20Lille%20-%20Ecole%20des%20m%C3%A9tiers%20du%20digital!5e0!3m2!1sfr!2sfr!4v1771501146557!5m2!1sfr!2sfr"
                    className="w-full h-full mt-18"
                    style={{ border: 0 }}
                    loading="lazy"
                ></iframe>
            </div>
            <div className="h-18"></div>
            <ContactForm />
            <Footer />
        </>
    );
}
