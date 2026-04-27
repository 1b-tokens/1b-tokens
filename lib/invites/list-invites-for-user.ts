import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export type InviteListRow = {
  id: string;
  invitee_email: string;
  invitee_full_name: string;
  pitch: string;
  status: "pending" | "submitted";
  created_at: string;
};

export async function listInvitesForUser(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("invites")
    .select(
      "id, invitee_email, invitee_full_name, pitch, status, created_at",
    )
    .eq("inviter_clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as InviteListRow[];
}
