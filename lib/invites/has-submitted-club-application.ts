import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * True when this user has completed the join application form and we stored a row
 * in `invite_applications` (any invite). That is the gate for sending new invites.
 */
export async function hasSubmittedClubApplication(clerkUserId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("invite_applications")
    .select("id")
    .eq("applicant_clerk_user_id", clerkUserId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data != null;
}
