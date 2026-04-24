import { createClient } from "@supabase/supabase-js";
import type { StyleProfile } from "@/lib/types";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnon);

/* ── Profile helpers ── */

export async function loadProfile(userId: string): Promise<StyleProfile | null> {
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
  await supabase
    .from("profiles")
    .upsert({ id: userId, ...profile }, { onConflict: "id" });
}
