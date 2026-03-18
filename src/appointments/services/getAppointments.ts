import { supabase } from "../../lib/supabase";

export async function getAppointments() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("NO_SESSION");
  }

  const res = await fetch("/api/appointments", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "FAILED_TO_FETCH_APPOINTMENTS");
  }

  const data = await res.json();
  return data.appointments;
}
