// components/ProsCarousel.tsx
import { useEffect, useState, useRef } from "react";
import type { Professional } from "./FindPro";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProCard from "./ProCard";

interface ProsCarouselProps {
  jobs: string[];
  refreshKey?: number;
  onBooked?: () => void;
}

function ProsCarousel({ jobs, refreshKey, onBooked }: ProsCarouselProps) {
  const [pros, setPros] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPros = async () => {
      try {
        setLoading(true);

        const requests = jobs.map((job) =>
          fetch(`/api/professionals?job=${encodeURIComponent(job)}`).then(
            (res) => (res.ok ? res.json() : null),
          ),
        );

        const results = await Promise.all(requests);

        const allPros: Professional[] = results
          .filter(Boolean)
          .flatMap((result) => result.professionals || []);

        const uniquePros = Array.from(
          new Map(allPros.map((pro) => [pro.id, pro])).values(),
        );

        uniquePros.sort((a, b) => {
          const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
          const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setPros(uniquePros);
      } catch (error) {
        console.error("Error fetching pros", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobs?.length > 0) fetchPros();
    else {
      setPros([]);
      setLoading(false);
    }
  }, [jobs]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -170 : 170,
      behavior: "smooth",
    });
  };

  if (loading) return <p className="text-gray-500 text-sm">Chargement...</p>;
  if (pros.length === 0)
    return <p className="text-gray-500 text-sm">Aucun professionnel trouvé.</p>;

  return (
    <div className="relative">
      {/* Flèche gauche */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/30 backdrop-blur-xl shadow-md rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
      </button>

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth py-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {pros.map((pro) => (
          <ProCard
            key={pro.id}
            pro={pro}
            refreshKey={refreshKey}
            onBooked={onBooked}
          />
        ))}
      </div>

      {/* Flèche droite */}

      <button
        onClick={() => scroll("right")}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/30 backdrop-blur-xl shadow-md rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <ChevronRight className="w-4 h-4 text-primary" />
      </button>
    </div>
  );
}

export default ProsCarousel;
