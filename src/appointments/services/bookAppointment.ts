import { supabase } from "../../lib/supabase";

export type BookAppointmentPayload = {
  userBId: string;
  date: string;
};

export async function bookAppointment(proId: string, selectedDate: string) {
  if (!selectedDate) {
    throw new Error("Veuillez sélectionner une date.");
  }

  const dateObj = new Date(selectedDate);
  const hour = dateObj.getHours();

  if (hour < 7 || hour > 20) {
    throw new Error(
      "Les rendez-vous sont disponibles uniquement entre 7h00 et 20h00.",
    );
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  const payload: BookAppointmentPayload = {
    userBId: proId,
    date: dateObj.toISOString(),
  };

  const res = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Erreur lors de la réservation.";

    try {
      const error = await res.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(errorMessage);
  }

  return res.json();
}
