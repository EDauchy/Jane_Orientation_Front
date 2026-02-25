'use client'
import Header from "../components/home/Header";
import Hero from "../components/home/Hero";
import FAQ from "../components/home/FAQ";
import Testimonials from "../components/home/Testimonials"
import CallToAction from '../components/home/CallToAction'
import BenefitsSection from "../components/home/Benefits"
import VideoPromo from "../components/home/VideoPromo"
import Footer from "../components/home/Footer"
import CustomSection from '../components/home/CustomSection'
import ArticleListSection from '../components/home/ArticleList'
import ContactForm from '../components/home/ContactForm'
import Modal from '../components/home/Modal'
import { useState } from "react";
import { useLocation } from 'react-router-dom';
import CountdownGuard from "../components/home/CountdownGuard";
import { APP_CONFIG } from "../constants/config";

export default function Home() {


  const [open, setOpen] = useState<boolean>(false);
    useLocation();
    return (
    <>
      <Header />
      <Hero />

      <CustomSection title={"DÉCOUVREZ VOTRE CHEMIN, PAS CELUI DES AUTRES"}>
        <BenefitsSection />
      </CustomSection>

      <VideoPromo />

      <CustomSection title={"Jane vous guide là où vous êtes fait pour briller"}>
        <Testimonials />
      </CustomSection>

      <CountdownGuard targetDate={APP_CONFIG.TARGET_DATE}
        containerClass=""
        color="text-black">
            <CallToAction />
      </CountdownGuard>

      <CustomSection title={"L’avenir appartient à ceux qui choisissent en connaissance"}>
        <ArticleListSection />
      </CustomSection>


      <CustomSection title={"Passez de la question à la conviction"}>
        <FAQ isVisible={true} />
      </CustomSection>



      {/* <ContactForm/> */}


      <Footer />
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ContactForm />
      </Modal>
  


    </>
  );
}
