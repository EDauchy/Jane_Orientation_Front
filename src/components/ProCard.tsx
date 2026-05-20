// components/ProCard.tsx
import React, { useEffect, useState } from "react";
import type { Professional } from "./FindPro";
import { IoMdMail } from "react-icons/io";
import { BiCalendar } from "react-icons/bi";
import { User } from "lucide-react";
import { supabase } from "../lib/supabase";
import FindProSingle from "./FindProSignle";

interface ProCardProps {
  pro: Professional;
  refreshKey?: number;
  onBooked?: () => void;
}

const ProCard: React.FC<ProCardProps> = ({ pro, refreshKey, onBooked }) => {
  const [open, setOpen] = useState(false);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        const res = await fetch("/api/appointments", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserAppointments(data.appointments || []);
        }
      } catch (error) {
        console.error("Error fetching appointments", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [refreshKey]);

  const appointment = userAppointments.find(
    (a) =>
      a.user_b_id === pro.id &&
      ["PENDING", "CONFIRMED", "RESCHEDULED"].includes(a.status),
  );

  const appointmentDateStr = appointment?.date;

  return (
    <div className="p-2 bg-white rounded-xl shadow-md w-[150px] flex flex-col gap-1.5 items-center flex-shrink-0">
      {/* Avatar */}
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="flex justify-center items-center absolute top-0 left-0 z-10 w-[22px] h-[22px] bg-white rounded-br-[6px]">
          <IoMdMail className="text-primary text-[10px]" />
        </div>

        {pro.avatar_url ? (
          <img
            src={pro.avatar_url}
            className="w-full h-full object-cover"
            alt={pro.first_name}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary/40" />
          </div>
        )}
      </div>

      {/* Name & Profession */}
      <p className="font-extrabold text-primary text-xs leading-tight text-center">
        {pro.first_name} {pro.last_name?.charAt(0)}.
      </p>
      <p className="rounded-full py-0.5 px-2 bg-primary text-white text-[10px] font-medium leading-tight">
        {pro.user_b_details.profession}
      </p>

      {/* Date */}
      {loadingAppointments ? (
        <span className="text-[9px] text-gray-400">...</span>
      ) : appointmentDateStr ? (
        <div className="flex items-center gap-1">
          <BiCalendar className="text-primary text-[10px]" />
          <span className="text-[10px] font-bold text-gray-700">
            {new Date(appointmentDateStr).toLocaleDateString()}
          </span>
        </div>
      ) : (
        <div
          className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => setOpen(true)}
        >
          <BiCalendar className="text-secondary text-[10px]" />
          <span className="text-[10px] text-secondary font-medium">
            Prendre RDV
          </span>
        </div>
      )}

      <FindProSingle
        professional={pro}
        open={open}
        onClose={() => setOpen(false)}
        onBooked={onBooked}
      />
    </div>
  );
};

export default ProCard;
