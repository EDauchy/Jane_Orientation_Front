'use client'

import Header from "../components/home/Header";
import { useState } from "react";
import Hero from "../components/home/Hero.tsx";
import CustomSection from "../components/home/CustomSection.tsx";
import BenefitsSection from "../components/home/Benefits.tsx";
import VideoPromo from "../components/home/VideoPromo.tsx";
import Testimonials from "../components/home/Testimonials.tsx";
import CountdownGuard from "../components/home/CountdownGuard.tsx";
import { APP_CONFIG } from "../constants/config.ts";
import CallToAction from "../components/home/CallToAction.tsx";
import ArticleListSection from "../components/home/ArticleList.tsx";
import FAQ from "../components/home/FAQ.tsx";
import Footer from "../components/home/Footer.tsx";
import Modal from "../components/home/Modal.tsx";
import ContactForm from "../components/home/ContactForm.tsx";

export default function Home() {

  const [open, setOpen] = useState<boolean>(false);
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

      <CountdownGuard
        targetDate={APP_CONFIG.TARGET_DATE}
        containerClass=""
        color="text-black"
      >
        <CallToAction />
      </CountdownGuard>

      <CustomSection title={"L’avenir appartient à ceux qui choisissent en connaissance"}>
        <ArticleListSection />
      </CustomSection>

      <CustomSection title={"Passez de la question à la conviction"}>
        <FAQ isVisible={true} />
      </CustomSection>

      <Footer />

      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ContactForm />
      </Modal>
    </>
  );
}