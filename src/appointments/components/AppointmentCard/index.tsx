// components/AppointmentCard.tsx
import type { Appointment } from "../../types";
import AppointmentAvatar from "./AppointmentAvatar";
import StatusIndicator from "./StatusIndicator";
import AppointmentMenu from "./AppointmentMenu";
import AppointmentDetailModal from "../AppointmentDetailModal";
import { useState } from "react";

interface AppointmentCardProps {
  appointment: Appointment;
  currentUserId: string;
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
  variant?: "default" | "minimal";
}

export default function AppointmentCard({
  appointment: apt,
  currentUserId,
  onUpdateStatus,
  onOpenReviewModal,
  onOpenRescheduleModal,
  onOpenConfirmDeleteModal,
  variant = "default",
}: AppointmentCardProps) {
  const isMinimal = variant === "minimal";
  const aptDate = new Date(apt.date);

  const isUserA = apt.user_a?.id === currentUserId;
  const otherUser = isUserA ? apt.user_b : apt.user_a;

  const sharedMenuProps = {
    appointment: apt,
    currentUserId,
    onUpdateStatus,
    onOpenReviewModal,
    onOpenRescheduleModal,
    onOpenConfirmDeleteModal,
  };

  const [detailModal, setDetailModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setDetailModal(true)}
        className="bg-white border border-3 border-primary rounded-full shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all flex items-center gap-2 cursor-pointer"
      >
        {/* Avatar */}
        <AppointmentAvatar
          src={otherUser?.avatar_url}
          size={isMinimal ? "sm" : "md"}
          alt={`${otherUser?.first_name} ${otherUser?.last_name}`}
        />

        {/* Identity + date */}
        {isMinimal ? (
          <div className="flex flex-col">
            <span
              title={`${otherUser?.first_name} ${otherUser?.last_name}`}
              className="font-extrabold text-primary w-full max-w-[80px] text-xs text-ellipsis overflow-hidden whitespace-nowrap"
            >
              {otherUser?.first_name} {otherUser?.last_name}
            </span>
            <span className="font-bold text-primary text-[10px]">
              {aptDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ) : (
          <>
            <div className="font-extrabold text-primary text-xs pr-3 py-1 border-r-3 border-primary whitespace-nowrap self-center">
              {otherUser?.first_name} {otherUser?.last_name}
            </div>
            <div className="font-bold text-primary flex flex-col uppercase grow text-[11px] py-1">
              <span>Le {aptDate.toLocaleDateString("fr-FR")}</span>
              <span>
                à{" "}
                {aptDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </>
        )}

        {/* Spacer (minimal only) */}
        {isMinimal && <div className="grow" />}

        {/* Status */}
        <StatusIndicator
          status={apt.status}
          display={isMinimal ? "dot" : "badge"}
        />

        {/* Actions menu */}
        <div onClick={(e) => e.stopPropagation()}>
          <AppointmentMenu {...sharedMenuProps} showStatus={isMinimal} />
        </div>
      </div>

      {/* Detail modal */}
      {detailModal && (
        <AppointmentDetailModal
          appointment={apt}
          open={detailModal}
          currentUserId={currentUserId}
          onClose={() => setDetailModal(false)}
          onOpenConfirmDeleteModal={onOpenConfirmDeleteModal}
          onOpenRescheduleModal={onOpenRescheduleModal}
          onOpenReviewModal={onOpenReviewModal}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </>
  );
}
