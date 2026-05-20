import { useState } from "react";
import type { Appointment } from "../types";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { addDays, startOfWeek, format, isSameDay } from "date-fns";
import AppointmentCard from "./AppointmentCard";

type AppointmentCalendarProps = {
  appointments: Appointment[];
  currentUserId: string;
  loading: boolean;
  onUpdateStatus: (
    id: string,
    status: string | undefined,
    date?: string,
  ) => void;
  onOpenReviewModal: (id: string, name: string) => void;
  onOpenRescheduleModal: (
    id: string,
    date: string,
    proAvailability?: any,
    isUserA?: boolean,
  ) => void;
  onOpenConfirmDeleteModal: (
    id: string,
    title: string,
    confirmBtnText?: string,
  ) => void;
};

export default function AppointmentCalendar({
  appointments,
  currentUserId,
  loading,
  onUpdateStatus,
  onOpenReviewModal,
  onOpenRescheduleModal,
  onOpenConfirmDeleteModal,
}: AppointmentCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  // Monday to Friday only (no Saturday & Sunday)
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    addDays(currentWeekStart, i),
  );

  const nextWeek = () => setCurrentWeekStart(addDays(currentWeekStart, 7));
  const prevWeek = () => setCurrentWeekStart(addDays(currentWeekStart, -7));

  return (
    <div className="flex flex-col gap-4">
      {/* Week Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={prevWeek}
          className="cursor-pointer text-primary hover:text-primary-dark rounded-full transition-colors p-3 hover:bg-gray-200"
        >
          <ChevronLeft />
        </button>
        <span className="uppercase text-xl font-bold text-primary">
          {format(currentWeekStart, "dd MMM yyyy")} -{" "}
          {format(addDays(currentWeekStart, 4), "dd MMM yyyy")}
        </span>
        <button
          onClick={nextWeek}
          className="cursor-pointer text-primary hover:text-primary-dark rounded-full transition-colors p-3 hover:bg-gray-200"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Weekly Grid (Mon–Fri) */}
      <div className="grid grid-cols-7 gap-6">
        {weekDays.map((day) => {
          const dayAppointments = appointments.filter((apt) =>
            isSameDay(new Date(apt.date), day),
          );

          return (
            <div key={day.toISOString()} className="flex flex-col gap-6">
              <div className="font-bold text-primary uppercase border-b-2 border-primary">
                {format(day, "EEEE")}
              </div>

              {dayAppointments.length === 0 && (
                <div className="text-gray-400 text-xs text-center">
                  No appointments
                </div>
              )}

              {dayAppointments.map((apt) => (
                <AppointmentCard
                  variant="minimal"
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
        })}
      </div>

      {loading && <div>Loading appointments...</div>}
    </div>
  );
}
