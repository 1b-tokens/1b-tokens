import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type InviteRow = {
  id: string;
  inviter_clerk_user_id: string;
  invitee_email: string;
  invitee_full_name: string;
  pitch: string;
  token: string;
  status: "pending" | "submitted";
  created_at: string;
  updated_at: string;
};

export async function getInviteByToken(token: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as InviteRow | null;
}
