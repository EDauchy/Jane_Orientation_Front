import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import { Link } from "react-router-dom";

const team = [
  { name: "KHACHNANE Adenan", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },
  { name: "BONEFONS Alexandre", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },
  { name: "CARTEGNIE Nathan", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },
  { name: "DAUCHY Esteban", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },
  { name: "EL MOUDEN Anas", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },
  { name: "EYEANG ZEHRI Najiba Laure", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },
  { name: "TAIRI Mayess", role: "Développeur Full-Stack", school: "Étudiant en Mastère 1", img: "/img-homme.png" },

];

const TeamCard = ({ name, role, school, img }: { name: string; role: string; school: string; img: string }) => (
  <div className="w-70 flex flex-col items-center bg-white border border-gray-100 rounded-3xl p-4 shadow-sm w-50px">
    <div className="w-full h-60 rounded-2xl overflow-hidden mb-3">
      <img src={img} alt={name} className="w-full h-full object-cover" />
    </div>
    <p className="font-montserrat font-black text-primary uppercase text-2xl tracking-wide text-center">{name}</p>
    <span className="mt-1 bg-primary text-white text-[10px] font-semibold px-3 py-0.5 rounded-full">
      {role}
    </span>
    <p className="font-roboto font-semibold text-gray-400 text-[11px] mt-1">{school}</p>
    
  </div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-white font-roboto">
      <Header />

      {/* ── QUI SOMMES NOUS ── */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24">
        {/* Main card */}
        <div className="relative max-w-2xl mx-auto bg-primary rounded-3xl px-8 py-10 text-center text-white mt-10">
          {/* Badge utilisateurs actifs */}
          <div className="absolute flex flex-col items-center px-5 py-2 rounded-2xl -left-5 -top-5 bg-white/20 backdrop-blur-md shadow-xl">
            <div className="flex -space-x-2 mb-1">
              {["/img-homme.png", "/img-femme.png", "/img-homme.png"].map((src, i) => (
                <img key={i} src={src} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white" />
              ))}
            </div>
            <p className="font-montserrat font-black text-white text-sm leading-none">200+</p>
            <p className="font-roboto font-semibold text-white/80 text-[10px] leading-tight">Utilisateurs actifs</p>
          </div>

          <h1 className="font-montserrat font-black text-3xl md:text-4xl uppercase mb-6">
            Qui sommes nous ?
          </h1>
          <p className="font-roboto font-semibold text-white/90 text-sm md:text-base leading-relaxed">
            Nous sommes une équipe de cinq développeurs passionnés issus de Ynov Campus, composée de quatre développeurs full-stack et d'un développeur front-end. Dans le cadre de notre formation, nous avons donné vie à Jane Orientation, un projet innovant conçu et suivi par notre école. Notre mission est de créer des solutions technologiques intuitives pour accompagner et orienter les utilisateurs dans leurs choix, avec engagement et créativité.
          </p>

          {/* Decorative squares */}
          <div className="absolute -bottom-4 -right-6 flex gap-1.5">
            <div className="w-7 h-7 bg-white/30 backdrop-blur-md border border-white/60 rounded-sm drop-shadow-xl" />
            <div className="w-4 h-4 bg-white/20 backdrop-blur-md border border-white/50 rounded-sm self-end drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* ── NOTRE ÉQUIPE ── */}
      <section className="py-16 px-6 md:px-12">
        <h2 className="font-montserrat font-black text-3xl uppercase text-primary text-center mb-12">
          Notre équipe
        </h2>

        {/* Row 1 – 3 cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          {team.map((member, i) => (
            <TeamCard key={i} {...member} />
          ))}
        </div>

      </section>

      {/* ── ENVIE D'ÉCHANGER ── */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <h2 className="font-montserrat font-black text-2xl md:text-3xl uppercase text-brand-orange text-center mb-8">
          Envie d'échanger avec nous ?
        </h2>

        <div className="max-w-xl mx-auto bg-brand-orange rounded-3xl px-8 py-10 text-white text-center">
          <p className="font-roboto font-semibold text-sm md:text-base leading-relaxed mb-6">
            Nous sommes à votre écoute ! Si vous avez des questions, des suggestions ou simplement envie de nous
            contacter, n'hésitez pas. Ensemble, nous construisons un projet qui répond à vos besoins.
          </p>
          <Link
            to="/contact"
            className="inline-block border-2 bg-white border-white text-primary font-montserrat font-semibold text-sm uppercase tracking-widest px-6 py-2.5 rounded-full transition-all"
          >
            Contact nous
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
