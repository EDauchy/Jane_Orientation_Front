import type { Appointment } from '../types';
import AppointmentCard from './AppointmentCard';

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

  return (
    <div className="space-y-4">
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
    </div>
  );
}