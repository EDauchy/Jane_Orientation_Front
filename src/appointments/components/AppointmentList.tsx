import { Clock } from "lucide-react";
import type { Appointment } from "../types";
import AppointmentCard from "./AppointmentCard";
import { useEffect, useState } from "react";
import AvailabilityEditor from "./AvailabilityEditor";
import { getProfile } from "../services/getProfile";

interface AppointmentListProps {
  appointments: Appointment[];
  currentUserId: string;
  loading: boolean;
  onUpdateStatus: (id: string, status: string | undefined, date?: string) => void;
  onOpenReviewModal: (id: string, name: string) => void;
  onOpenRescheduleModal: (
    id: string,
    date: string,
    proAvailability?: any,
    isUserA?: boolean
  ) => void;
  onOpenConfirmDeleteModal: (
    id: string,
    title: string,
    confirmBtnText?: string
  ) => void;
}

export default function AppointmentList({
  appointments,
  currentUserId,
  loading,
  onUpdateStatus,
  onOpenReviewModal,
  onOpenRescheduleModal,
  onOpenConfirmDeleteModal,
}: AppointmentListProps) {
  // ---------------- PROFILE ----------------
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const isUserA = currentProfile?.role === "user_reconversion";

  const handleAvailabilitySave = (newAvailability: any) => {
    setCurrentProfile((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        availability: newAvailability,
      },
    }));
  };

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await getProfile();
      setCurrentProfile(data);
    } catch {
      console.error("Impossible de charger le profil");
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
            Authorization: "Bearer 8ff1502f8f35bc488fb3959674febddaed4254b6ae72ff00f347e00f4980ce67",
          },
          body: JSON.stringify({
            appellations: [
              {
                intitule: jobInput,
                identifiant: "1",
                contexte: "", // ex: "informatique"
              },
            ],
            options: {
              nomAppelant: "my-app",
              nbResultats: 5,
            },
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur API");
      }

      const data = await res.json();
      setJobPredictions(data?.resultats || []);
    } catch (err) {
      console.error("Erreur prediction:", err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  // ---------------- UI ----------------
  if (loading) return <div>Loading appointments...</div>;

  if (appointments.length === 0) {
    return <div className="text-gray-500">Aucun rendez-vous prévu.</div>;
  }

  return (
    <div className="space-y-4">
      {/* ----------- TEST API ----------- */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">
          Tester prédiction métier
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={jobInput}
            onChange={(e) => setJobInput(e.target.value)}
            placeholder="Ex: développeur web"
            className="border p-2 flex-1 rounded"
          />

          <button onClick={fetchJobPrediction} className="button-primary">
            Tester
          </button>
        </div>

        {loadingPrediction && <p className="mt-2">Chargement...</p>}

        <ul className="mt-2 text-sm">
          {jobPredictions.map((pred: any, index: number) => (
            <li key={index} className="border-b py-1">
              {pred.libelle} ({pred.score})
            </li>
          ))}
        </ul>
      </div>

      {/* ----------- LISTE RDV ----------- */}
      {appointments.map((apt) => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          currentUserId={currentUserId}
          onUpdateStatus={onUpdateStatus}
          onOpenReviewModal={onOpenReviewModal}
          onOpenRescheduleModal={onOpenRescheduleModal}
          onOpenConfirmDeleteModal={onOpenConfirmDeleteModal}
        />
      ))}

      {/* ----------- DISPONIBILITES ----------- */}
      {!isUserA && !loadingProfile && currentProfile && (
        <>
          <button
            onClick={() => setShowAvailabilityEditor(true)}
            className="button-primary"
          >
            <Clock className="w-4 h-4" />
            Gérer mes disponibilités
          </button>

          <AvailabilityEditor
            initialAvailability={currentProfile.details?.availability}
            open={showAvailabilityEditor}
            onSave={handleAvailabilitySave}
            onClose={() => setShowAvailabilityEditor(false)}
          />
        </>
      )}
    </div>
  );
}