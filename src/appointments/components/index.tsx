import { useState, useEffect } from "react";
import type { Appointment } from "../types";
import { getAppointments } from "../services/getAppointments";
import { updateAppointmentStatus } from "../services/updateAppointmentStatus";
import AppointmentList from "./AppointmentList";
import AppointmentsCalendar from "./AppointmentCalendar";
import ReviewModal from "../../components/ReviewModal";
import RescheduleModal from "./RescheduleModal";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Toast from "../../components/Toast";
import { useAuth } from "../../context/AuthContext";

interface AppointmentsContainerProps {
  variant: "list" | "calendar";
  refreshKey?: number;
  onAppointmentChange?: () => void;
}

export default function AppointmentsContainer({
  variant,
  refreshKey,
  onAppointmentChange,
}: AppointmentsContainerProps) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [reviewModal, setReviewModal] = useState<{
    appointmentId: string;
    professionalName: string;
  } | null>(null);
  const [rescheduleModal, setRescheduleModal] = useState<{
    appointmentId: string;
    currentDate: string;
    proAvailability?: any;
    isUserA?: boolean;
  } | null>(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<{
    appointmentId: string;
    title: string;
    confirmBtnText?: string;
  } | null>(null);

  // ─── Data fetching ────────────────────────────────────────────────────────────

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch {
      showToast("Impossible de charger les rendez-vous", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (refreshKey !== undefined && refreshKey > 0) fetchAppointments();
  }, [refreshKey]);

  // ─── Status update ────────────────────────────────────────────────────────────

  const updateStatus = async (
    id: string,
    status: string | undefined,
    date?: string,
  ) => {
    try {
      await updateAppointmentStatus(id, { status, date });

      const successMessage =
        status === "CONFIRMED"
          ? "Rendez-vous confirmé !"
          : status === "CANCELLED"
            ? "Rendez-vous annulé"
            : date
              ? "Nouvelle date proposée !"
              : "Rendez-vous mis à jour";

      showToast(successMessage, "success");
      fetchAppointments();
      onAppointmentChange?.();
    } catch (error: any) {
      showToast(error.message || "Erreur lors de la mise à jour", "error");
    }
  };

  // ─── Toast helper ─────────────────────────────────────────────────────────────

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Reschedule submit (validates + delegates to updateStatus) ────────────────

  const handleRescheduleSubmit = (date: string) => {
    const dateObj = new Date(date);
    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();

    if (hour < 7 || hour > 20 || (hour === 20 && minute > 0)) {
      showToast(
        "Les rendez-vous sont disponibles uniquement entre 7h00 et 20h00",
        "error",
      );
      return;
    }

    if (!rescheduleModal?.isUserA) {
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      if (dateObj <= oneHourFromNow) {
        showToast(
          "Vous devez proposer un créneau au moins 1 heure après l'heure actuelle",
          "error",
        );
        return;
      }
    }

    updateStatus(rescheduleModal!.appointmentId, undefined, date);
    setRescheduleModal(null);
  };

  // ─── Shared props for both views ──────────────────────────────────────────────

  const sharedProps = {
    appointments,
    currentUserId: user?.id ?? "",
    loading,
    onUpdateStatus: updateStatus,
    onOpenReviewModal: (id: string, name: string) =>
      setReviewModal({ appointmentId: id, professionalName: name }),
    onOpenRescheduleModal: (
      id: string,
      date: string,
      proAvailability?: any,
      isUserA?: boolean,
    ) =>
      setRescheduleModal({
        appointmentId: id,
        currentDate: date,
        proAvailability,
        isUserA,
      }),
    onOpenConfirmDeleteModal: (
      id: string,
      title: string,
      confirmBtnText?: string,
    ) => setConfirmDeleteModal({ appointmentId: id, title, confirmBtnText }),
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {variant === "calendar" ? (
        <AppointmentsCalendar {...sharedProps} />
      ) : (
        <AppointmentList {...sharedProps} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {reviewModal && (
        <ReviewModal
          {...reviewModal}
          onClose={() => setReviewModal(null)}
          onSuccess={fetchAppointments}
        />
      )}

      {rescheduleModal && (
        <RescheduleModal
          isOpen
          currentDate={rescheduleModal.currentDate}
          proAvailability={rescheduleModal.proAvailability}
          isUserA={rescheduleModal.isUserA}
          onClose={() => setRescheduleModal(null)}
          onSubmit={handleRescheduleSubmit}
        />
      )}

      {confirmDeleteModal && (
        <ConfirmDeleteModal
          isOpen
          title={confirmDeleteModal.title}
          confirmText={confirmDeleteModal.confirmBtnText ?? "Supprimer"}
          cancelText="Retour"
          onClose={() => setConfirmDeleteModal(null)}
          onConfirm={() => {
            updateStatus(confirmDeleteModal.appointmentId, "CANCELLED");
            setConfirmDeleteModal(null);
          }}
        />
      )}
    </>
  );
}
