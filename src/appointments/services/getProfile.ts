import { supabase } from "../../lib/supabase";

export async function getProfile() {
  // 1. Get session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error("SESSION_ERROR");
  }

  if (!session?.access_token) {
    throw new Error("NO_SESSION");
  }

  // 2. Fetch API
  const res = await fetch("/api/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  // 3. Handle API errors (same pattern as appointments)
  if (!res.ok) {
    const text = await res.text().catch(() => "");

    if (res.status === 401 || res.status === 403) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(text || "FAILED_TO_FETCH_PROFILE");
  }

  // 4. Parse safely
  const data = await res.json();

  if (!data?.user) {
    throw new Error("INVALID_PROFILE_RESPONSE");
  }

  return data.user;
}
