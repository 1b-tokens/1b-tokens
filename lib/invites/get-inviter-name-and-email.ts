import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

/** Resolves the inviter's display name and email from Clerk for admin notifications. */
export async function getInviterNameAndEmail(inviterClerkUserId: string): Promise<{
  name: string;
  email: string;
}> {
  try {
    const client = await clerkClient();
    const u = await client.users.getUser(inviterClerkUserId);
    const name =
      [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
      u.username ||
      "Member";
    const primary = u.emailAddresses.find(
      (e) => e.id === u.primaryEmailAddressId,
    );
    const email =
      primary?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? "";
    return { name, email: email || "Not available" };
  } catch {
    return { name: "Member (unavailable)", email: "Not available" };
  }
}
