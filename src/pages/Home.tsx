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

  // ---------------- PREDICTION METIER ----------------
  const [jobInput, setJobInput] = useState("");
  const [jobPredictions, setJobPredictions] = useState<any[]>([]);
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  const fetchJobPrediction = async () => {
    if (!jobInput) return;

    try {
      setLoadingPrediction(true);

      const res = await fetch(
        "https://api.francetravail.io/partenaire/romeo/v2/predictionMetiers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ROMEO_API_KEY}`, // ⚠️ à sécuriser en prod
          },
          body: JSON.stringify({
            appellations: [
              {
                intitule: jobInput,
                identifiant: "1",
                contexte: "orientation professionnelle",
              },
            ],
            options: {
              nomAppelant: "home-page",
              nbResultats: 5,
            },
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setJobPredictions(data?.resultats || []);
    } catch (err) {
      console.error("Erreur prediction:", err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  return (
    <>
      <Header />
      <Hero />

      {/* ----------- NOUVEAU BLOC IA ----------- */}
      <CustomSection title={"Trouvez votre métier en quelques secondes"}>
        <div className="max-w-2xl mx-auto text-center space-y-4">

          <p className="text-gray-600">
            Décrivez ce que vous aimez faire, on vous propose des métiers adaptés.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={jobInput}
              onChange={(e) => setJobInput(e.target.value)}
              placeholder="Ex: j'aime coder des sites web"
              className="border p-3 flex-1 rounded"
            />

            <button
              onClick={fetchJobPrediction}
              className="button-primary"
            >
              Trouver
            </button>
          </div>

          {loadingPrediction && <p>Analyse en cours...</p>}

          {jobPredictions.length > 0 && (
            <div className="text-left mt-4 bg-gray-50 p-4 rounded">
              <p className="font-semibold mb-2">Métiers suggérés :</p>

              <ul className="space-y-1">
                {jobPredictions.map((pred: any, index: number) => (
                  <li key={index} className="flex justify-between border-b py-1">
                    <span>{pred.libelle}</span>
                    <span className="text-gray-400 text-sm">
                      {Math.round(pred.score * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CustomSection>

      {/* ----------- RESTE DE TA PAGE ----------- */}
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