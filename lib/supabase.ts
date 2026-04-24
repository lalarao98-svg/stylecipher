import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StyleProfile } from "@/lib/types";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Only create the client when both env vars are present
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

/* ── Profile helpers ── */

export async function loadProfile(userId: string): Promise<StyleProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return data as StyleProfile;
}

export async function saveProfile(
  userId: string,
  profile: Partial<StyleProfile>,
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("profiles")
    .upsert({ id: userId, ...profile }, { onConflict: "id" });
}
