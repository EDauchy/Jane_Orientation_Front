import { supabase } from "../../lib/supabase";

export type UpdateAppointmentPayload = {
  status: string | undefined;
  date?: string;
};

export async function updateAppointmentStatus(
  id: string,
  payload: UpdateAppointmentPayload,
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("NO_SESSION");
  }

  const res = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMessage = "Impossible de mettre à jour le rendez-vous";

    try {
      const error = await res.json();
      errorMessage = error.error || errorMessage;
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(errorMessage);
  }

  return res.json(); // optional if your API returns data
}
