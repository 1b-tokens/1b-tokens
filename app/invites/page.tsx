import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { listInvitesForUser } from "@/lib/invites/list-invites-for-user";

import { InvitesDashboard } from "./invites-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Invites",
  robots: { index: false, follow: false },
};

export default async function InvitesPage() {
  const { userId } = await auth();
  let initialInvites: Awaited<ReturnType<typeof listInvitesForUser>> = [];

  if (userId) {
    try {
      initialInvites = await listInvitesForUser(userId);
    } catch {
      initialInvites = [];
    }
  }

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[var(--content-max)] px-5 py-12 sm:px-8"
    >
      <header className="max-w-3xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange">
          Member tools
        </p>
        <h1 className="mt-3 text-4xl font-bold uppercase leading-tight tracking-[-0.07em] text-paper sm:text-5xl">
          Invites
        </h1>
        <p className="mt-4 text-sm font-medium leading-relaxed text-paper/65">
          Membership is invite-only. You can have up to three open invites at a
          time. Each person receives an email with a private link to read about
          the club and submit a free application.
        </p>
      </header>

      <InvitesDashboard initialInvites={initialInvites} />
    </main>
  );
}
