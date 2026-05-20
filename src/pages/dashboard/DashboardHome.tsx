// pages/dashboard/DashboardHome.tsx
import { useState } from "react";
import PageLoader from "../../components/ui/PageLoader";
import { useDashboard } from "../../context/DashboardContext";
import FindPro from "../../components/FindPro";
import AppointmentsContainer from "../../appointments/components/index";
import ProsCarousel from "../../components/ProsCarousel";
import StyledTitle from "../../components/home/StyledTitle";
import FavoritesList from "../../components/FavoritesList";

export default function DashboardHome() {
  const { profile, loading } = useDashboard();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  if (loading) return <PageLoader />;
  if (!profile)
    return <div className="p-8">Erreur de chargement du profil.</div>;

  const isPro = profile.role === "user_pro";
  const hasTestResults = profile.details?.test_results?.length > 0;

  return (
    <>
      <div className="space-y-6 p-8">
        <StyledTitle text="Dashboard" className="text-[1.7rem] pt-1" />
        {isPro ? (
          <div className="flex flex-col gap-8">
            <div className="min-h-[400px]">
              <AppointmentsContainer
                variant="calendar"
                refreshKey={refreshKey}
                onAppointmentChange={handleRefresh}
              />
            </div>
            <div className="w-full bg-secondary h-1 opacity-[0.4] rounded-full" />
            <h3 className="text-2xl font-bold uppercase text-primary">
              Mes RDV
            </h3>
            <AppointmentsContainer
              variant="list"
              refreshKey={refreshKey}
              onAppointmentChange={handleRefresh}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* RDV + Résultats côte à côte */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-5 w-[70%] min-h-[150px]">
                <h3 className="text-lg font-bold uppercase text-primary">
                  Mes RDV
                </h3>
                <AppointmentsContainer
                  variant="list"
                  refreshKey={refreshKey}
                  onAppointmentChange={handleRefresh}
                />
              </div>

              <div className="w-1 bg-secondary opacity-[0.4] rounded-full" />

              <div className="w-[30%]">
                <h3 className="text-lg font-bold uppercase text-primary mb-4">
                  Mes conseils
                </h3>
                {hasTestResults ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.details.test_results.map(
                      (job: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                        >
                          {job}
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Complète le quiz d'orientation pour voir tes métiers
                    suggérés ici.
                  </p>
                )}
              </div>
            </div>
            <div className="w-full bg-secondary h-1 opacity-[0.4] rounded-full" />

            <div className="flex gap-2">
              <div className="flex flex-col gap-5 w-[43%]">
                <h3 className="text-lg font-bold uppercase text-primary">
                  Demander un Rendez-vous
                </h3>
                <ProsCarousel
                  jobs={profile.details?.test_results || []}
                  refreshKey={refreshKey}
                  onBooked={handleRefresh}
                />
              </div>
              <div className="w-1 bg-secondary opacity-[0.4] rounded-full" />

              <FavoritesList />
            </div>
          </div>
        )}
      </div>

      {selectedJob && (
        <FindPro job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}
