import { Clock } from 'lucide-react';
import type { Appointment } from '../types';
import AppointmentCard from './AppointmentCard';
import { useEffect, useState } from 'react';
import AvailabilityEditor from './AvailabilityEditor';
import { getProfile } from '../services/getProfile';

interface AppointmentListProps {
  appointments: Appointment[];
  currentUserId: string;
  loading: boolean;
  onUpdateStatus: (id: string, status: string | undefined, date?: string) => void;
  onOpenReviewModal: (id: string, name: string) => void;
  onOpenRescheduleModal: (id: string, date: string, proAvailability?: any, isUserA?: boolean) => void;
  onOpenConfirmDeleteModal: (id: string, title: string, confirmBtnText?: string) => void;
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
  if (loading) return <div>Loading appointments...</div>;

  if (appointments.length === 0) {
    return <div className="text-gray-500">Aucun rendez-vous prévu.</div>;
  }

  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const isUserA = currentProfile?.role === 'user_reconversion';

  const handleAvailabilitySave = (newAvailability: any) => {
    setCurrentProfile((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        availability: newAvailability
      }
    }));
  };

  const fetchAppointments = async () => {
    try {
      setLoadingProfile(true);
      const data = await getProfile();
      setCurrentProfile(data);
    } catch {
      console.error('Impossible de charger le profil');
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  return (
    <div className="space-y-2">
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
      {(!isUserA && (!loadingProfile && currentProfile)) && <>{<button
        onClick={() => setShowAvailabilityEditor(true)}
        className="button-primary"
      >
        <Clock className="w-4 h-4" />
        Gérer mes disponibilités
      </button>}
        {currentProfile &&
          <AvailabilityEditor
            initialAvailability={currentProfile.details?.availability}
            open={showAvailabilityEditor}
            onSave={handleAvailabilitySave}
            onClose={() => setShowAvailabilityEditor(false)}
          />}</>}
    </div>
  );
}